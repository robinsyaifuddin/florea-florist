import crypto from 'crypto';

export const AUTH_COOKIE_NAME = 'florea_admin_session';

const SESSION_SECRET = process.env.SESSION_SECRET || 'florea_super_secret_session_salt_2026';

/**
 * Buat session token HMAC-SHA256 valid 30 hari
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 Hari
  const payloadStr = JSON.stringify({ role: 'admin', exp: expiresAt });
  const payloadEncoded = Buffer.from(payloadStr).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadEncoded)
    .digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifikasi signature dan masa aktif token session (timing-safe)
 */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadEncoded, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadEncoded)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return false;
    }

    const payloadRaw = Buffer.from(payloadEncoded, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadRaw);

    if (payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}
