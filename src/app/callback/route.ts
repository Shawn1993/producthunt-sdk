import { NextResponse } from 'next/server';
import { tokenStorage } from '@/services/tokenStorage';

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
    const requestBody = {
      client_id: process.env.PRODUCT_HUNT_API_TOKEN,
      client_secret: process.env.PRODUCT_HUNT_API_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.PRODUCT_HUNT_REDIRECT_URI,
    };
    console.log('请求体:', requestBody);

    const tokenResponse = await fetch('https://api.producthunt.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await tokenResponse.json();
    console.log('令牌响应数据:', data);

    if (!tokenResponse.ok) {
      console.error('获取令牌失败:', data.error);
      throw new Error(data.error || '获取访问令牌失败');
    }

    // 保存访问令牌到数据库
    await tokenStorage.setToken('producthunt', data.access_token);
    console.log('成功保存 Product Hunt 访问令牌到数据库');

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('OAuth 回调处理错误:', error);
    return NextResponse.json(
      { error: '认证过程失败' },
      { status: 500 }
    );
  }
} 