/**
 * GET /api/demo-enrich?t=TOKEN&mode=...
 *
 * Phone modes  → /v1/search (linkedin) or /v2/full (name+company/domain)
 * Email mode   → /v6/findEmail (name + company OR domain passed as "company")
 *
 * Rate limits (configurable via env):
 *   DEMO_PHONE_LIMIT (default 100) phones/IP/24h
 *   DEMO_EMAIL_LIMIT (default 100) emails/IP/24h
 */

import { createHmac } from "node:crypto";

const DATAGMA_SEARCH    = "https://gateway.datagma.net/api/ingress/v1/search";
const DATAGMA_FULL      = "https://gateway.datagma.net/api/ingress/v2/full";
const DATAGMA_EMAIL     = "https://gateway.datagma.net/api/ingress/v6/findEmail";
const TURNSTILE_VERIFY  = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const ALLOWED_ORIGINS = [
  "https://datagma.com",
  "https://www.datagma.com",
  "https://datagma.vercel.app",
];

// ── HMAC token ────────────────────────────────────────────────────────────────
function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const now = Math.floor(Date.now() / 300_000);
  return [now, now - 1].some((b) =>
    createHmac("sha256", secret).update(String(b)).digest("hex").slice(0, 24) === token
  );
}

// ── Rate limits — per IP and per browser fingerprint (visitorId) ─────────────
const phoneRateMap    = new Map();
const emailRateMap    = new Map();
const fidPhoneRateMap = new Map(); // same limits applied to FingerprintJS visitorId
const fidEmailRateMap = new Map();

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

// ── Phone masking (+33 6 65 40 90 47 → +33665•••47) ──────────────────────────
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

// ── ipinfo.io — datacenter/proxy IP detection ─────────────────────────────────
// The free plan doesn't include the `hosting` field.
// We parse the ASN from the `org` field ("AS16509 Amazon.com, Inc.")
// and match against a curated list of datacenter/proxy ASNs.
// Fails OPEN on any error (never blocks real users due to ipinfo outage).

const DATACENTER_ASNS = new Set([
  "AS16509",  // Amazon AWS
  "AS14618",  // Amazon AWS (us-east)
  "AS15169",  // Google Cloud
  "AS8075",   // Microsoft Azure
  "AS8069",   // Microsoft
  "AS14061",  // DigitalOcean
  "AS20473",  // Vultr / Choopa
  "AS24940",  // Hetzner Online
  "AS16276",  // OVH SAS
  "AS12876",  // Scaleway / Iliad
  "AS36351",  // SoftLayer / IBM Cloud
  "AS60781",  // LeaseWeb
  "AS197540", // NetCup
  "AS51167",  // Contabo
  "AS63949",  // Linode / Akamai Cloud
  "AS6939",   // Hurricane Electric (transit/hosting)
  "AS9009",   // M247 (large proxy network)
  "AS53667",  // FranTech / BuyVM
  "AS3842",   // RamNode
  "AS46562",  // Performive
  "AS40676",  // Psychz Networks
  "AS32475",  // SingleHop
  "AS26347",  // DreamHost
  "AS7203",   // Namecheap
  "AS55286",  // B2 Net Solutions
  "AS4224",   // 1&1 / IONOS
  "AS47583",  // Hostinger
]);

const ipinfoCache = new Map(); // in-memory cache per warm function instance

async function checkIpReputation(ip, token) {
  if (!token || !ip || ip === "unknown") return { ok: true };
  if (ipinfoCache.has(ip)) return ipinfoCache.get(ip);
  try {
    const r = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${token}`, {
      headers: { accept: "application/json" },
      signal:  AbortSignal.timeout(3_000),
    });
    const d = await r.json();

    // Plan payant: hosting field present
    if (d.hosting === true) {
      const result = { ok: false, reason: "datacenter_ip", org: d.org ?? "" };
      ipinfoCache.set(ip, result);
      return result;
    }

    // Plan gratuit: parse ASN from org field ("AS16509 Amazon.com, Inc.")
    const asn = (d.org ?? "").match(/^(AS\d+)/i)?.[1]?.toUpperCase() ?? "";
    if (asn && DATACENTER_ASNS.has(asn)) {
      const result = { ok: false, reason: "datacenter_ip", org: d.org ?? "" };
      ipinfoCache.set(ip, result);
      return result;
    }

    const result = { ok: true };
    ipinfoCache.set(ip, result);
    if (ipinfoCache.size > 500) ipinfoCache.clear();
    return result;
  } catch {
    return { ok: true }; // fail open — never block on ipinfo outage
  }
}

// ── Cloudflare Turnstile verification ─────────────────────────────────────────
// Returns true if valid, or true if no secret configured (dev mode).
async function verifyTurnstile(cfToken, ip, secret) {
  if (!secret) return true; // secret not set → skip (dev/test)
  if (!cfToken) return false;
  try {
    const r = await fetch(TURNSTILE_VERIFY, {
      method:  "POST",
      headers: { "content-type": "application/json" },
      body:    JSON.stringify({ secret, response: cfToken, remoteip: ip }),
      signal:  AbortSignal.timeout(5_000),
    });
    const d = await r.json();
    return d.success === true;
  } catch {
    return false; // network error → fail closed
  }
}

// ── Detect Datagma API errors ─────────────────────────────────────────────────
function apiError(data) {
  if (!data || typeof data !== "object") return null;
  if (data.code === 13 || data.message === "can't get credit") return "no_credits";
  if (data.code === 5) return "not_found";
  if (data.code === 3) return "bad_request";
  return null;
}

// ── Extract phones ─────────────────────────────────────────────────────────────
// /v1/search  → data.person.phones[].{ displayInternational, linkedWhatsapp, whatsapp.isIn }
// /v2/full    → data.phoneFull.phones[].{ displayInternational, linkedWhatsapp }
function extractPhones(data) {
  if (!data) return [];
  const searchPerson = data.person;
  if (searchPerson && Array.isArray(searchPerson.phones) && searchPerson.phones.length > 0) {
    return searchPerson.phones.map((p) => ({
      number:   p.displayInternational ?? (p.countryCode ? `+${p.countryCode}${p.number}` : p.number) ?? "",
      whatsapp: !!(p.linkedWhatsapp ?? p.whatsapp?.isIn ?? false),
    })).filter((p) => p.number && p.number.length > 4);
  }
  const pf = data.phoneFull;
  if (pf && typeof pf === "object" && Array.isArray(pf.phones)) {
    return pf.phones.map((p) => ({
      number:   p.displayInternational ?? (p.countryCode ? `+${p.countryCode}${p.number}` : p.number) ?? "",
      whatsapp: !!(p.linkedWhatsapp ?? false),
    })).filter((p) => p.number && p.number.length > 4);
  }
  return [];
}

// ── Extract email from phone-finder API responses ─────────────────────────────
// /v1/search → data.person.emails[].address
// /v2/full   → data.email or data.emailV2 or data.person.basic.legacyEmail
function extractPhoneApiEmail(data) {
  if (!data) return null;
  const isValid = (s) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
  const searchPerson = data.person;
  if (searchPerson && Array.isArray(searchPerson.emails)) {
    for (const e of searchPerson.emails) {
      if (isValid(e.address)) return e.address.trim().toLowerCase();
    }
  }
  for (const field of [data.email, data.emailV2]) {
    if (isValid(field)) return field.trim().toLowerCase();
  }
  const basic = data.person?.basic ?? null;
  if (basic && isValid(basic.legacyEmail)) return basic.legacyEmail.trim().toLowerCase();
  return null;
}

// ── Extract contact info ───────────────────────────────────────────────────────
// /v2/full   → data.person.basic.{ name, linkedInUrl, city, region, country }
// /v1/search → data.person.{ names[], jobs[], addresses[], urls[] }
function extractContact(data) {
  if (!data) return {};
  const person = data.person ?? null;
  if (!person) return {};
  if (person.basic) {
    const b = person.basic;
    return {
      fullName:    b.name ?? (`${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() || null),
      jobTitle:    b.jobTitle   || null,
      company:     b.company    || null,
      linkedinUrl: b.linkedInUrl || null,
      location:    [b.city, b.region, b.country].filter(Boolean).join(", ") || null,
      photo:       null,
    };
  }
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

// ── Main handler ───────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();

  const isProd           = process.env.VERCEL_ENV === "production";
  const apiKey           = (process.env.DATAGMA_API_KEY    ?? "").trim();
  const secret           = (process.env.DEMO_SECRET        ?? "").trim();
  const turnstileSecret  = (process.env.TURNSTILE_SECRET   ?? "").trim();
  const ipinfoToken      = (process.env.IPINFO_TOKEN       ?? "").trim();

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

  const ip  = (req.headers["x-forwarded-for"] ?? "unknown").split(",")[0].trim();
  const fid = clean(req.query?.fid ?? "", 64); // FingerprintJS visitorId (optional)

  // ── Layer 1 — Cloudflare Turnstile (bot + datacenter browser check) ────────
  const cfToken = clean(req.query?.cf ?? "", 2048);
  const cfOk    = await verifyTurnstile(cfToken, ip, turnstileSecret);
  if (!cfOk) return res.status(403).json({ error: "bot_detected" });

  // ── Layer 2 — ipinfo.io (datacenter/hosting IP block) ─────────────────────
  // Runs in parallel with nothing to wait for — fast path if token not set.
  if (ipinfoToken) {
    const ipRep = await checkIpReputation(ip, ipinfoToken);
    if (!ipRep.ok) return res.status(403).json({ error: "datacenter_ip" });
  }
  const mode = clean(req.query?.mode ?? "linkedin", 20);

  const PHONE_LIMIT = process.env.DEMO_PHONE_LIMIT ? parseInt(process.env.DEMO_PHONE_LIMIT) : 3;
  const EMAIL_LIMIT = process.env.DEMO_EMAIL_LIMIT ? parseInt(process.env.DEMO_EMAIL_LIMIT) : 10;

  // Rate check by IP
  const phoneLimits = checkLimit(phoneRateMap, ip, PHONE_LIMIT);
  const emailLimits = checkLimit(emailRateMap, ip, EMAIL_LIMIT);

  // Rate check by browser fingerprint (catches proxy rotation)
  const fidPhoneLimits = fid ? checkLimit(fidPhoneRateMap, fid, PHONE_LIMIT) : { exceeded: false };
  const fidEmailLimits = fid ? checkLimit(fidEmailRateMap, fid, EMAIL_LIMIT) : { exceeded: false };

  // Exceeded if EITHER the IP or the fingerprint is over limit
  const phoneExceeded = phoneLimits.exceeded || fidPhoneLimits.exceeded;
  const emailExceeded = emailLimits.exceeded || fidEmailLimits.exceeded;

  // Read inputs
  const linkedin    = cleanLinkedin(req.query?.linkedin    ?? "");
  const fullName    = clean(        req.query?.fullName    ?? "");
  const domain      = cleanDomain(  req.query?.domain      ?? "");
  const companyName = clean(        req.query?.companyName ?? "");
  // Validate
  const valid =
    (mode === "linkedin"   && linkedin) ||
    (mode === "nameDomain" && fullName && domain) ||
    (mode === "nameCompany"&& fullName && companyName) ||
    (mode === "findEmail"  && fullName && domain);

  if (!valid) return res.status(400).json({ error: "missing_inputs", mode });

  // ── PHONE MODES ─────────────────────────────────────────────────────────────
  if (mode === "linkedin" || mode === "nameDomain" || mode === "nameCompany") {

    if (phoneExceeded) {
      return res.status(429).json({
        error: "rate_limited",
        credits: { phonesRemaining: 0, resetsAt: phoneLimits.resetAt },
      });
    }

    let apiData = null;
    try {
      if (mode === "linkedin") {
        const r = await callAPI(DATAGMA_SEARCH, {
          username: linkedin, minimumMatch: 1, whatsappCheck: true,
        }, apiKey);
        if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
        apiData = r.data;
      } else if (mode === "nameDomain") {
        const r = await callAPI(DATAGMA_FULL, {
          fullName, domain, data: "EMAIL", phoneFull: true,
        }, apiKey);
        if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
        apiData = r.data;
      } else if (mode === "nameCompany") {
        const r = await callAPI(DATAGMA_FULL, {
          fullName, companyName, data: "EMAIL", phoneFull: true,
        }, apiKey);
        if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
        apiData = r.data;
      }
    } catch {
      return res.status(502).json({ error: "upstream_error" });
    }

    if (!apiData) return res.status(404).json({ error: "not_found" });
    const err = apiError(apiData);
    if (err === "no_credits") return res.status(402).json({ error: "no_credits" });
    if (err === "not_found")  return res.status(404).json({ error: "not_found" });

    const phones  = extractPhones(apiData);
    const contact = extractContact(apiData);
    const hasPhone = phones.length > 0;

    let phoneResult = null;
    if (hasPhone) {
      consumeCredit(phoneRateMap, ip, PHONE_LIMIT);
      if (fid) consumeCredit(fidPhoneRateMap, fid, PHONE_LIMIT);
      phoneResult = {
        masked:   maskPhone(phones[0].number),
        whatsapp: phones[0].whatsapp,
        count:    phones.length,
      };
    }

    const phoneLimitsAfter = checkLimit(phoneRateMap, ip, PHONE_LIMIT);

    return res.status(200).json({
      contact,
      phone:   phoneResult,
      credits: { phonesRemaining: phoneLimitsAfter.remaining, resetsAt: phoneLimitsAfter.resetAt },
      found:   hasPhone || !!(contact.fullName),
    });
  }

  // ── EMAIL MODE (/v6/findEmail) ───────────────────────────────────────────────
  if (mode === "findEmail") {

    if (emailExceeded) {
      return res.status(429).json({
        error: "rate_limited",
        credits: { emailsRemaining: 0, resetsAt: emailLimits.resetAt },
      });
    }

    let apiData = null;
    try {
      const r = await callAPI(DATAGMA_EMAIL, {
        fullName,
        company:            domain,
        findEmailV2Step:    3,
        findEmailV2Country: "General",
      }, apiKey);
      if (r.status === 0) return res.status(503).json({ error: "api_unreachable" });
      apiData = r.data;
    } catch {
      return res.status(502).json({ error: "upstream_error" });
    }

    if (!apiData) return res.status(404).json({ error: "not_found" });
    const err = apiError(apiData);
    if (err === "no_credits") return res.status(402).json({ error: "no_credits" });

    // /v6/findEmail response shape
    const status        = apiData.status ?? "NotFound";  // "Valid" | "MostProbable" | "NotFound"
    const verifiedEmail = status === "Valid"        ? (apiData.email ?? null) : null;
    const probableEmail = status === "MostProbable" ? ((apiData.mostProbableEmail ?? [])[0] ?? null) : null;
    const foundEmail    = verifiedEmail || probableEmail;

    if (!foundEmail && status === "NotFound") {
      return res.status(200).json({
        found: false,
        contact: { fullName, company: companyOrDomain },
        email: null, emailStatus: "not_found",
        credits: { emailsRemaining: emailLimits.remaining, resetsAt: emailLimits.resetAt },
      });
    }

    // Only consume credit for verified emails (Datagma doesn't bill for probable)
    if (verifiedEmail) {
      consumeCredit(emailRateMap, ip, EMAIL_LIMIT);
      if (fid) consumeCredit(fidEmailRateMap, fid, EMAIL_LIMIT);
    }

    const emailLimitsAfter = checkLimit(emailRateMap, ip, EMAIL_LIMIT);

    return res.status(200).json({
      found:       true,
      contact:     { fullName, company: companyOrDomain },
      email:       foundEmail,
      emailStatus: verifiedEmail ? "verified" : "probable",
      credits:     { emailsRemaining: emailLimitsAfter.remaining, resetsAt: emailLimitsAfter.resetAt },
    });
  }

  return res.status(400).json({ error: "unknown_mode", mode });
}
