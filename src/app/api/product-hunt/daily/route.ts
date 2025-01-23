import { NextResponse } from 'next/server';
import { getDailyPosts } from '@/services/productHunt';

export async function GET() {
  try {
    const posts = await getDailyPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: '获取 Product Hunt 日榜失败' },
      { status: 500 }
    );
  }
} 