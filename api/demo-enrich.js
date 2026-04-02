/**
 * GET /api/demo-enrich?t=TOKEN&mode=...
 *
 * 5 modes:
 *   linkedin    → /v1/search by LinkedIn URL      (phone + email, ~30 credits)
 *   nameCompany → /v2/full name+company           (phone + email, ~31 credits)
 *   nameDomain  → /v2/full name+domain            (phone + email, ~31 credits)
 *   nameEmail   → /v1/search by email+name        (phone + email, ~30 credits)
 *   emailOnly   → /v2/full name+domain, email only (email only,   ~1 credit)
 *
 * Security: HMAC token + Origin check + per-IP rate limits
 */

import { createHmac } from "node:crypto";

const DATAGMA_SEARCH = "https://gateway.datagma.net/api/ingress/v1/search";
const DATAGMA_FULL   = "https://gateway.datagma.net/api/ingress/v2/full";
const ALLOWED_ORIGINS = [
  "https://datagma.com",
  "https://www.datagma.com",
  "https://datagma.vercel.app",
];

// ── HMAC token verification ───────────────────────────────────────────────────
function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const now = Math.floor(Date.now() / 300_000);
  return [now, now - 1].some((b) =>
    createHmac("sha256", secret).update(String(b)).digest("hex").slice(0, 24) === token
  );
}

// ── Rate limits ───────────────────────────────────────────────────────────────
const phoneRateMap = new Map();
const emailRateMap = new Map();

function getEntry(map, ip, windowMs) {
  const now = Date.now();
  const e = map.get(ip) ?? { count: 0, resetAt: now + windowMs };
  if (now > e.resetAt) { e.count = 0; e.resetAt = now + windowMs; }
  return e;
}
function checkLimit(map, ip, max, windowMs = 86_400_000) {
  const e = getEntry(map, ip, windowMs);
  return { remaining: Math.max(0, max - e.count), resetAt: e.resetAt, exceeded: e.count >= max };
}
function consumeCredit(map, ip, max, windowMs = 86_400_000) {
  const e = getEntry(map, ip, windowMs);
  if (e.count < max) { e.count++; map.set(ip, e); return true; }
  map.set(ip, e); return false;
}

// ── Sanitisers ────────────────────────────────────────────────────────────────
function clean(raw, max = 100) {
  return String(raw ?? "").trim().replace(/[<>"'&]/g, "").slice(0, max);
}
function cleanEmail(raw) {
  const s = clean(raw, 150).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : "";
}
function cleanLinkedin(raw) {
  const s = clean(raw, 300);
  return /linkedin\.com\//i.test(s) ? s : "";
}
function cleanDomain(raw) {
  const s = clean(raw, 120);
  if (!s) return "";
  try { if (/^https?:\/\//i.test(s)) return new URL(s).hostname; } catch {}
  return /[\s@/?#]/.test(s) ? "" : s.toLowerCase();
}

// ── Phone masking (+33 6 65 40 90 47 → +33 6 65 ••••47) ─────────────────────
function maskPhone(phone) {
  const s = String(phone).replace(/[\s\-\.()\u00a0]/g, "");
  if (s.length < 6) return s;
  const showStart = Math.min(7, Math.floor(s.length * 0.55));
  const showEnd   = 2;
  const maskLen   = s.length - showStart - showEnd;
  if (maskLen <= 0) return s;
  return s.slice(0, showStart) + "•".repeat(maskLen) + s.slice(-showEnd);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function callAPI(baseUrl, params, apiKey) {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("apiId", apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
    const r    = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      signal:  AbortSignal.timeout(25_000),
    });
    const text = await r.text();
    return { ok: r.ok, status: r.status, data: safeJson(text) };
  } catch (e) {
    return { ok: false, status: 0, data: null, error: e.message };
  }
}
function safeJson(text) { try { return JSON.parse(text); } catch { return null; } }

// ── Detect Datagma API-level errors ──────────────────────────────────────────
function apiError(data) {
  if (!data || typeof data !== "object") return null;
  if (data.code === 13 || data.message === "can't get credit") return "no_credits";
  if (data.code === 5  && data.message === "Not found") return "not_found";
  if (data.code === 3) return "bad_request";
  return null;
}

// ── Extract phones ────────────────────────────────────────────────────────────
// /v1/search:  data.person.phones[].{ displayInternational, linkedWhatsapp, whatsapp.isIn }
// /v2/full:    data.phoneFull.phones[].{ displayInternational, linkedWhatsapp }
function extractPhones(data) {
  if (!data) return [];

  // /v1/search shape
  const searchPerson = data.person;
  if (searchPerson && Array.isArray(searchPerson.phones) && searchPerson.phones.length > 0) {
    return searchPerson.phones.map((p) => ({
      number:   p.displayInternational ?? (p.countryCode ? `+${p.countryCode}${p.number}` : p.number) ?? "",
      whatsapp: !!(p.linkedWhatsapp ?? p.whatsapp?.isIn ?? false),
    })).filter((p) => p.number && p.number.length > 4);
  }

  // /v2/full shape — phoneFull is an OBJECT { phones: [...], emails: [...] }
  const pf = data.phoneFull;
  if (pf && typeof pf === "object" && Array.isArray(pf.phones)) {
    return pf.phones.map((p) => ({
      number:   p.displayInternational ?? (p.countryCode ? `+${p.countryCode}${p.number}` : p.number) ?? "",
      whatsapp: !!(p.linkedWhatsapp ?? false),
    })).filter((p) => p.number && p.number.length > 4);
  }

  return [];
}

// ── Extract email ─────────────────────────────────────────────────────────────
// /v1/search:  data.person.emails[].address
// /v2/full:    data.email  OR  data.emailV2  OR  data.person.basic.legacyEmail
function extractEmail(data) {
  if (!data) return null;
  const isValid = (s) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

  // /v1/search shape
  const searchPerson = data.person;
  if (searchPerson && Array.isArray(searchPerson.emails)) {
    for (const e of searchPerson.emails) {
      if (isValid(e.address)) return e.address.trim().toLowerCase();
    }
  }

  // /v2/full top-level fields
  for (const field of [data.email, data.emailV2]) {
    if (isValid(field)) return field.trim().toLowerCase();
  }

  // /v2/full person.basic.legacyEmail
  const basic = data.person?.basic ?? null;
  if (basic && isValid(basic.legacyEmail)) return basic.legacyEmail.trim().toLowerCase();

  return null;
}

// ── Extract contact info ──────────────────────────────────────────────────────
// /v1/search:  data.person.{ names[], jobs[], addresses[], urls[], images[] }
// /v2/full:    data.person.basic.{ name, firstName, lastName, linkedInUrl, ... }
function extractContact(data) {
  if (!data) return {};

  const person = data.person ?? null;
  if (!person) return {};

  // /v2/full shape has person.basic
  if (person.basic) {
    const b = person.basic;
    return {
      fullName:    b.name ?? `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() || null,
      jobTitle:    b.jobTitle   || null,
      company:     b.company    || null,
      linkedinUrl: b.linkedInUrl || null,
      location:    [b.city, b.region, b.country].filter(Boolean).join(", ") || null,
      photo:       null,
    };
  }

  // /v1/search shape
  const nameObj  = (person.names ?? [])[0] ?? null;
  const fullName = nameObj ? `${nameObj.first ?? ""} ${nameObj.last ?? ""}`.trim() : null;
  const job      = (person.jobs ?? [])[0] ?? null;
  const location = (person.addresses ?? [])[0]?.display ?? null;
  const linkedin = (person.urls ?? []).find((u) => u.domain === "linkedin.com")?.url ?? null;

  return {
    fullName,
    jobTitle:    job?.title   ?? null,
    company:     job?.company ?? null,
    linkedinUrl: linkedin,
    location,
    photo:       (person.images ?? [])[0]?.url ?? null,
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();

  const isProd = process.env.VERCEL_ENV === "production";
  const apiKey = process.env.DATAGMA_API_KEY;
  const secret = process.env.DEMO_SECRET;

  if (!apiKey || !secret) return res.status(501).json({ error: "not_configured" });

  if (isProd) {
    const origin  = req.headers["origin"]  ?? "";
    const referer = req.headers["referer"] ?? "";
    if (!ALLOWED_ORIGINS.some((o) => origin.startsWith(o) || referer.startsWith(o))) {
      return res.status(403).json({ error: "forbidden" });
    }
  }

  const token = clean(req.query?.t ?? "", 32);
  if (!verifyToken(token, secret)) return res.status(401).json({ error: "invalid_token" });

  const ip   = (req.headers["x-forwarded-for"] ?? "unknown").split(",")[0].trim();
  const mode = clean(req.query?.mode ?? "linkedin", 20);

  const linkedin    = cleanLinkedin(req.query?.linkedin    ?? "");
  const email       = cleanEmail(   req.query?.email       ?? "");
  const fullName    = clean(        req.query?.fullName    ?? "");
  const domain      = cleanDomain(  req.query?.domain      ?? "");
  const companyName = clean(        req.query?.companyName ?? "");

  const valid =
    (mode === "linkedin"    && linkedin) ||
    (mode === "nameEmail"   && fullName && email) ||
    (mode === "nameDomain"  && fullName && domain) ||
    (mode === "nameCompany" && fullName && companyName) ||
    (mode === "emailOnly"   && fullName && (domain || companyName));

  if (!valid) return res.status(400).json({ error: "missing_inputs", mode });

  // Phone is expensive (30 credits). Skip if user's phone limit is already exceeded.
  const phoneLimits = checkLimit(phoneRateMap, ip, 3);
  const emailLimits = checkLimit(emailRateMap, ip, 3);

  const wantPhone = mode !== "emailOnly" && !phoneLimits.exceeded;

  // ── Call Datagma ────────────────────────────────────────────────────────────
  let apiData = null;

  try {
    if (mode === "linkedin") {
      const r = await callAPI(DATAGMA_SEARCH, {
        username: linkedin, minimumMatch: 1, whatsappCheck: true,
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;

    } else if (mode === "nameEmail") {
      const r = await callAPI(DATAGMA_SEARCH, {
        email, fullName, minimumMatch: 1, whatsappCheck: true,
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;

    } else if (mode === "nameDomain" || mode === "emailOnly") {
      const params = { fullName, domain, data: "EMAIL" };
      if (wantPhone) params.phoneFull = true;
      const r = await callAPI(DATAGMA_FULL, params, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;

    } else if (mode === "nameCompany") {
      const params = { fullName, companyName, data: "EMAIL" };
      if (wantPhone) params.phoneFull = true;
      const r = await callAPI(DATAGMA_FULL, params, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;
    }
  } catch {
    return res.status(502).json({ error: "upstream_error" });
  }

  if (!apiData) return res.status(404).json({ error: "not_found" });

  // Handle Datagma API-level errors
  const datagmaErr = apiError(apiData);
  if (datagmaErr === "no_credits") return res.status(402).json({ error: "no_credits" });
  if (datagmaErr === "not_found")  return res.status(404).json({ error: "not_found" });

  // Extract
  const phones   = extractPhones(apiData);
  const rawEmail = extractEmail(apiData);
  const contact  = extractContact(apiData);

  const hasPhone = phones.length > 0;
  const hasEmail = !!rawEmail;

  let phoneResult = null;
  let emailResult = null;

  if (hasPhone && !phoneLimits.exceeded) {
    consumeCredit(phoneRateMap, ip, 3);
    phoneResult = {
      masked:   maskPhone(phones[0].number),
      whatsapp: phones[0].whatsapp,
      count:    phones.length,
    };
  }

  if (hasEmail && !emailLimits.exceeded) {
    consumeCredit(emailRateMap, ip, 3);
    emailResult = rawEmail;
  }

  const phoneLimitsAfter = checkLimit(phoneRateMap, ip, 3);
  const emailLimitsAfter = checkLimit(emailRateMap, ip, 3);

  return res.status(200).json({
    contact,
    phone:             phoneResult,
    email:             emailResult,
    phoneLimitReached: hasPhone && phoneLimits.exceeded,
    emailLimitReached: hasEmail && emailLimits.exceeded,
    credits: {
      phonesRemaining: phoneLimitsAfter.remaining,
      emailsRemaining: emailLimitsAfter.remaining,
      resetsAt:        phoneLimitsAfter.resetAt,
    },
    found: hasPhone || hasEmail || !!(contact.fullName),
  });
}
