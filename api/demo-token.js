/**
 * GET /api/demo-token
 * Returns a short-lived HMAC token the demo widget must pass to /api/demo-enrich.
 * Token rotates every 5 minutes. Protects the enrich endpoint from direct scripted abuse.
 * Recycled from enrich-crm/api/demo-token.js.
 */

import { createHmac } from "node:crypto";

// 10 req/hour per IP for the token endpoint itself
const tokenRateMap = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const entry = tokenRateMap.get(ip) || { count: 0, resetAt: now + 3_600_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 3_600_000; }
  entry.count++;
  tokenRateMap.set(ip, entry);
  return entry.count > 10;
}

function makeToken(secret) {
  const bucket = Math.floor(Date.now() / 300_000); // 5-min window
  return createHmac("sha256", secret).update(String(bucket)).digest("hex").slice(0, 24);
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();

  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimit(ip)) {
    return res.status(429).json({ error: "too_many_requests" });
  }

  const secret = process.env.DEMO_SECRET;
  if (!secret) return res.status(501).json({ error: "demo_secret_not_configured" });

  const token = makeToken(secret);
  const expiresIn = 300 - (Math.floor(Date.now() / 1000) % 300);

  return res.status(200).json({ token, expiresIn });
}
