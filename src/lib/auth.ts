export const AUTH_COOKIE_NAME = 'florea_admin_session';

const SESSION_SECRET = process.env.SESSION_SECRET || 'florea_super_secret_session_salt_2026';

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Buat session token HMAC-SHA256 valid 30 hari (Web Crypto API kompatibel Edge & Node.js)
 */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 Hari
  const payloadStr = JSON.stringify({ role: 'admin', exp: expiresAt });
  const payloadEncoded = base64UrlEncode(new TextEncoder().encode(payloadStr));

  const key = await getHmacKey(SESSION_SECRET);
  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadEncoded)
  );

  const signature = base64UrlEncode(new Uint8Array(sigBuffer));
  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifikasi signature dan masa aktif token session (timing-safe via Web Crypto API)
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadEncoded, signature] = parts;

  try {
    const key = await getHmacKey(SESSION_SECRET);
    const sigBytes = base64UrlDecode(signature);
    const dataBytes = new TextEncoder().encode(payloadEncoded);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes.buffer as ArrayBuffer,
      dataBytes.buffer as ArrayBuffer
    );

    if (!isValid) return false;

    const payloadRaw = new TextDecoder().decode(base64UrlDecode(payloadEncoded));
    const payload = JSON.parse(payloadRaw);

    if (payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}
