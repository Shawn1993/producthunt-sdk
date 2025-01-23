import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: '未收到授权码' }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://api.producthunt.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.PRODUCT_HUNT_API_TOKEN,
        client_secret: process.env.PRODUCT_HUNT_API_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.PRODUCT_HUNT_REDIRECT_URI,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(data.error || '获取访问令牌失败');
    }

    // 在实际应用中，你可能需要保存这个 token
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('OAuth 回调处理错误:', error);
    return NextResponse.json(
      { error: '认证过程失败' },
      { status: 500 }
    );
  }
} 