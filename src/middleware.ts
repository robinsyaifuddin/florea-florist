import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi rute /admin (halaman)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token);

    // Kirim header agar halaman atau komponen tahu status autentikasi di server level
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-is-admin', isValid ? '1' : '0');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
