import { createSupabaseServerClient } from '../../../utils/supabase/server'; // Adjust path
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/'; // Redirect after login

  if (token_hash && type) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Error - redirect to custom error page or sign-in
  return NextResponse.redirect(new URL('/auth/error', request.url));
}
