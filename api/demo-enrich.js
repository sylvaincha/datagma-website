/**
 * GET /api/demo-enrich?t=TOKEN&mode=linkedin&linkedin=URL
 *
 * Proxies the Datagma API for the homepage demo widget.
 * 4 search modes: linkedin | nameEmail | nameDomain | nameCompany
 *
 * Security:
 *   1. HMAC token  — must come from /api/demo-token (5-min rotating window)
 *   2. Phone rate  — 3 phone results / IP / 24h (always shown masked: +33665****47)
 *   3. Email rate  — 3 email results / IP / 24h (shown in full)
 *   4. Origin check — datagma.com only in production
 *   5. API key    — server-side only, never reaches the browser
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

// ── Rate limits — separate counters per resource (24h windows) ────────────────
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
  return {
    remaining: Math.max(0, max - e.count),
    resetAt:   e.resetAt,
    exceeded:  e.count >= max,
  };
}

function consumeCredit(map, ip, max, windowMs = 86_400_000) {
  const e = getEntry(map, ip, windowMs);
  if (e.count < max) {
    e.count++;
    map.set(ip, e);
    return true;
  }
  map.set(ip, e);
  return false;
}

// ── Input sanitisers ──────────────────────────────────────────────────────────
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

// ── Phone masking  (+33665409047 → +33665****47) ──────────────────────────────
function maskPhone(phone) {
  const s = String(phone).replace(/[\s\-\.()\u00a0]/g, "");
  if (s.length < 6) return s;
  const showStart = Math.min(7, Math.floor(s.length * 0.55));
  const showEnd   = 2;
  const maskLen   = s.length - showStart - showEnd;
  if (maskLen <= 0) return s;
  return s.slice(0, showStart) + "•".repeat(maskLen) + s.slice(-showEnd);
}

// ── Call Datagma (non-throwing) ───────────────────────────────────────────────
async function callAPI(baseUrl, params, apiKey) {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("apiId", apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
    const res  = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      signal:  AbortSignal.timeout(25_000),
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, data: safeJson(text) };
  } catch (e) {
    return { ok: false, status: 0, data: null, error: e.message };
  }
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}

// ── Extract phones — handles /v1/search response shape ───────────────────────
// Response: { person: { phones: [{ displayInternational, countryCode, number, linkedWhatsapp, whatsapp }] } }
function extractPhones(data) {
  if (!data) return [];

  // /v1/search shape
  const person = data.person ?? null;
  if (person && Array.isArray(person.phones) && person.phones.length > 0) {
    return person.phones.map((p) => ({
      number:   p.displayInternational ?? (p.countryCode ? `+${p.countryCode}${p.number}` : p.number) ?? "",
      whatsapp: !!(p.linkedWhatsapp ?? p.whatsapp?.isIn ?? false),
    })).filter((p) => p.number && p.number.length > 4);
  }

  // /v2/full shape — phoneFull is a string or array
  if (data.phoneFull) {
    const pf = data.phoneFull;
    if (typeof pf === "string" && pf.length > 4) return [{ number: pf, whatsapp: false }];
    if (Array.isArray(pf)) return pf.filter(Boolean).map((n) => ({ number: String(n), whatsapp: false }));
  }

  return [];
}

// ── Extract email ─────────────────────────────────────────────────────────────
function extractEmail(data) {
  if (!data) return null;

  // /v1/search shape: person.emails[].address
  const person = data.person ?? null;
  if (person && Array.isArray(person.emails) && person.emails.length > 0) {
    const addr = person.emails[0].address ?? null;
    if (addr && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return addr.toLowerCase();
  }

  // /v2/full shape
  const e = data.email ?? data.emailV2 ?? null;
  if (e && typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())) {
    return e.trim().toLowerCase();
  }

  return null;
}

// ── Extract contact info ──────────────────────────────────────────────────────
function extractContact(data) {
  if (!data) return {};

  // /v1/search shape
  const person = data.person ?? null;
  if (person) {
    const nameObj  = (person.names ?? [])[0] ?? null;
    const fullName = nameObj
      ? `${nameObj.first ?? ""} ${nameObj.last ?? ""}`.trim()
      : null;
    const jobs     = person.jobs ?? [];
    const job      = jobs[0] ?? null;
    const location = (person.addresses ?? [])[0]?.display ?? null;
    const linkedin = (person.urls ?? []).find((u) => u.domain === "linkedin.com")?.url ?? null;
    return {
      fullName,
      jobTitle:    job?.title    ?? null,
      company:     job?.company  ?? null,
      linkedinUrl: linkedin,
      location,
      photo:       (person.images ?? [])[0]?.url ?? null,
    };
  }

  // /v2/full shape
  const d = data.data ?? data;
  return {
    fullName:    d.fullName    ?? d.name       ?? null,
    jobTitle:    d.jobTitle    ?? d.title      ?? null,
    company:     d.companyName ?? d.company    ?? null,
    linkedinUrl: d.linkedinUrl ?? null,
    location:    d.location    ?? null,
    photo:       d.photo       ?? null,
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

  // Origin check in production
  if (isProd) {
    const origin  = req.headers["origin"]  ?? "";
    const referer = req.headers["referer"] ?? "";
    if (!ALLOWED_ORIGINS.some((o) => origin.startsWith(o) || referer.startsWith(o))) {
      return res.status(403).json({ error: "forbidden" });
    }
  }

  // Token verification
  const token = clean(req.query?.t ?? "", 32);
  if (!verifyToken(token, secret)) {
    return res.status(401).json({ error: "invalid_token" });
  }

  const ip   = (req.headers["x-forwarded-for"] ?? "unknown").split(",")[0].trim();
  const mode = clean(req.query?.mode ?? "linkedin", 20);

  // Read inputs
  const linkedin    = cleanLinkedin(req.query?.linkedin    ?? "");
  const email       = cleanEmail(   req.query?.email       ?? "");
  const fullName    = clean(        req.query?.fullName    ?? "");
  const domain      = cleanDomain(  req.query?.domain      ?? "");
  const companyName = clean(        req.query?.companyName ?? "");

  // Validate required inputs per mode
  const valid = (mode === "linkedin"    && linkedin) ||
                (mode === "nameEmail"   && fullName && email) ||
                (mode === "nameDomain"  && fullName && domain) ||
                (mode === "nameCompany" && fullName && companyName);

  if (!valid) {
    return res.status(400).json({ error: "missing_inputs", mode });
  }

  // Check limits before calling API
  const phoneLimits = checkLimit(phoneRateMap, ip, 3);
  const emailLimits = checkLimit(emailRateMap, ip, 3);

  // Call Datagma API based on mode
  let apiData = null;
  let apiErr  = null;

  try {
    if (mode === "linkedin") {
      // /v1/search by LinkedIn URL
      const r = await callAPI(DATAGMA_SEARCH, {
        username:      linkedin,
        minimumMatch:  1,
        whatsappCheck: true,
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;
    } else if (mode === "nameEmail") {
      // /v1/search by email + fullName waterfall
      const r = await callAPI(DATAGMA_SEARCH, {
        email,
        fullName,
        minimumMatch:  1,
        whatsappCheck: true,
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;
    } else if (mode === "nameDomain") {
      // /v2/full by name + domain
      const r = await callAPI(DATAGMA_FULL, {
        fullName,
        domain,
        data:          "MAYD",
        phoneFull:     true,
        whatsappCheck: true,
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;
    } else if (mode === "nameCompany") {
      // /v2/full by name + company
      const r = await callAPI(DATAGMA_FULL, {
        fullName,
        companyName,
        data:          "MAYD",
        phoneFull:     true,
        whatsappCheck: true,
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;
    }
  } catch (e) {
    return res.status(502).json({ error: "upstream_error" });
  }

  if (!apiData) {
    return res.status(404).json({ error: "not_found" });
  }

  // Extract data
  const phones  = extractPhones(apiData);
  const rawEmail = extractEmail(apiData);
  const contact = extractContact(apiData);

  const hasPhone = phones.length > 0;
  const hasEmail = !!rawEmail;

  // Apply credits and build response
  let phoneResult = null;
  let emailResult = null;

  if (hasPhone) {
    if (!phoneLimits.exceeded) {
      consumeCredit(phoneRateMap, ip, 3);
      phoneResult = {
        masked:   maskPhone(phones[0].number),
        whatsapp: phones[0].whatsapp,
        count:    phones.length,
      };
    }
    // If limit exceeded: phoneResult stays null → frontend shows upgrade CTA
  }

  if (hasEmail) {
    if (!emailLimits.exceeded) {
      consumeCredit(emailRateMap, ip, 3);
      emailResult = rawEmail;
    }
  }

  const phoneLimitsAfter = checkLimit(phoneRateMap, ip, 3);
  const emailLimitsAfter = checkLimit(emailRateMap, ip, 3);

  return res.status(200).json({
    contact,
    phone:            phoneResult,
    email:            emailResult,
    phoneLimitReached: hasPhone && phoneLimits.exceeded,
    emailLimitReached: hasEmail && emailLimits.exceeded,
    credits: {
      phonesRemaining: phoneLimitsAfter.remaining,
      emailsRemaining: emailLimitsAfter.remaining,
      resetsAt:        phoneLimitsAfter.resetAt,
    },
    found: hasPhone || hasEmail,
  });
}
