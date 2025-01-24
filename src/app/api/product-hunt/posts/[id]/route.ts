import { NextRequest, NextResponse } from 'next/server';
import { productHuntService } from '@/services/productHunt';

export async function GET(
    request: NextRequest
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    if (!searchParams.get('id')) {
        return new NextResponse('帖子 ID 不能为空', { status: 400 });
    }
    const post = await productHuntService.getPost(searchParams.get('id')!);
    return NextResponse.json(post);
  } catch (error) {
    console.error('获取帖子失败:', error);
    return new NextResponse('获取帖子失败', { status: 500 });
  }
} 