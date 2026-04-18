/** Max length for QR payload URL (browser-safe). */
export const MAX_QR_URL_LENGTH = 2048;

export type ValidatedUrl = { ok: true; href: string } | { ok: false; message: string };

/**
 * Accepts http(s) URLs only. Prepends https:// when the scheme is missing.
 * Blocks obviously invalid hosts (empty, whitespace-only labels).
 */
export function validateWebUrl(raw: string): ValidatedUrl {
  const t = raw.trim();
  if (!t) {
    return { ok: false, message: "Enter a link to encode." };
  }
  if (t.length > MAX_QR_URL_LENGTH) {
    return { ok: false, message: `Link is too long (max ${MAX_QR_URL_LENGTH} characters).` };
  }

  let candidate = t;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(t)) {
    candidate = `https://${t}`;
  }

  let u: URL;
  try {
    u = new URL(candidate);
  } catch {
    return { ok: false, message: "That is not a valid web address." };
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, message: "Only http:// and https:// links are allowed." };
  }

  const host = u.hostname;
  if (!host) {
    return { ok: false, message: "Missing domain (e.g. example.com)." };
  }

  if (host.includes("..") || host.startsWith(".") || host.endsWith(".")) {
    return { ok: false, message: "Invalid domain." };
  }

  const labels = host.split(".");
  if (labels.some((l) => !l || l.length > 63)) {
    return { ok: false, message: "Invalid domain." };
  }

  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":");
  if (!isIp && !host.includes(".") && host !== "localhost") {
    return { ok: false, message: "Use a full domain (e.g. example.com) or localhost." };
  }

  return { ok: true, href: u.href };
}
