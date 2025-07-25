import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from './utils/supabase/server';

export async function middleware(request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/.*|subscribe).*)'],  // Added exclusions for /auth/* and /subscribe
};