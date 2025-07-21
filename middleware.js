import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from './utils/supabase/server'; // Adjust path

export async function middleware(request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes (e.g., if not logged in, redirect to sign-in)
  if (!user && request.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/confirm).*)'], // Exclude static files and callback
};
