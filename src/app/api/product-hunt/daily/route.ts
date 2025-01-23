import { NextResponse } from 'next/server';
import { getDailyPosts } from '@/services/productHunt';

export async function GET() {
  try {
    const posts = await getDailyPosts();
    return NextResponse.json({ posts });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '获取 Product Hunt 日榜失败';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 