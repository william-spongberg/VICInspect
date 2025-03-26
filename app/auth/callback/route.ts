import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // exchange auth code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // redirect to dashboard after successful login
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
