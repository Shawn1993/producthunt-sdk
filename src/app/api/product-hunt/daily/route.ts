import { NextResponse } from 'next/server';
import { getDailyPosts } from '@/services/productHunt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postedAfter = searchParams.get('postedAfter') || new Date().toISOString();

    const posts = await getDailyPosts(postedAfter);
    return NextResponse.json({ posts });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '获取 Product Hunt 日榜失败';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 