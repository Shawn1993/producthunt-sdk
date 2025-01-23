import { NextResponse } from 'next/server';

export async function GET() {
  const authUrl = new URL('https://api.producthunt.com/v2/oauth/authorize');
  authUrl.searchParams.append('client_id', process.env.PRODUCT_HUNT_API_TOKEN || '');
  authUrl.searchParams.append('redirect_uri', process.env.PRODUCT_HUNT_REDIRECT_URI || '');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'public+private');
  return NextResponse.redirect(authUrl.toString());
} 