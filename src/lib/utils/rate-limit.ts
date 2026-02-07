/**
 * Simple in-memory rate limiter for Server Actions.
 *
 * Uses a sliding window approach per key (typically IP or email).
 * NOT suitable for multi-instance deployments — use Redis-based
 * rate limiting (e.g., @upstash/ratelimit) for production at scale.
 *
 * For this MVP with a single Vercel serverless function, this provides
 * basic protection against brute-force and spam attacks.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 60s)
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

/**
 * Check if a request should be rate-limited.
 *
 * @param key - Unique identifier (e.g., "register:user@email.com" or "login:192.168.1.1")
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns `true` if the request is allowed, `false` if rate-limited
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000,
): boolean {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // First request or window expired — start new window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    // Over limit
    return false;
  }

  entry.count += 1;
  return true;
}
