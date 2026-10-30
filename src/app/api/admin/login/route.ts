import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, createSessionToken } from '@/lib/auth';

// Rate limiting sederhana berbasis IP untuk mencegah brute-force attack
const attemptsMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (!record || now > record.resetAt) {
    attemptsMap.set(ip, { count: 1, resetAt: now + 60 * 1000 }); // reset setiap 60 detik
    return true;
  }

  if (record.count >= 5) {
    return false; // Maksimal 5x salah per menit
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan masuk. Tunggu 1 menit lalu coba lagi.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Kata sandi salah. Silakan coba lagi.' },
        { status: 401 }
      );
    }

    // Buat session token aman berlaku 30 hari
    const token = createSessionToken();

    const response = NextResponse.json({ success: true, message: 'Login berhasil' });

    // Set cookie HttpOnly, Secure, SameSite=Lax, Max-Age 30 hari
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 hari dalam detik (persistent login)
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
