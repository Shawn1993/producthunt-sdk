import { NextResponse } from 'next/server';
import config from '@/config';

export async function GET() {
  const authUrl = new URL(config.api.productHunt.oauthUrl);
  authUrl.searchParams.append('client_id', process.env.PRODUCT_HUNT_API_TOKEN || '');
  authUrl.searchParams.append('redirect_uri', encodeURIComponent(config.api.productHunt.redirectUri));
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', config.api.productHunt.scopes.join('+'));

  return NextResponse.redirect(authUrl.toString());
} 