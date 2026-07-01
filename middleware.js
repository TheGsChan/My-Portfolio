import { NextResponse } from 'next/server';

const MOBILE_AGENTS = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only apply to the home page
  if (pathname !== '/') return NextResponse.next();

  // Skip if already on mobile page
  const ua = request.headers.get('user-agent') || '';
  const isMobile = MOBILE_AGENTS.test(ua);

  if (isMobile) {
    return NextResponse.redirect(new URL('/mobile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/mobile'],
};
