import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('开始处理 OAuth 回调请求');
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.warn('未收到授权码');
    return NextResponse.json({ error: '未收到授权码' }, { status: 400 });
  }

  try {
    console.log('开始请求访问令牌');
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
    console.log('令牌响应数据:', data);
    console.log('收到令牌响应:', { status: tokenResponse.status, ok: tokenResponse.ok });

    if (!tokenResponse.ok) {
      console.error('获取令牌失败:', data.error);
      throw new Error(data.error || '获取访问令牌失败');
    }

    console.log('成功获取访问令牌');
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