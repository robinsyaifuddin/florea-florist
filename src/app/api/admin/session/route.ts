import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    const isValid = verifySessionToken(token);

    return NextResponse.json({ authenticated: isValid });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
