import { NextRequest, NextResponse } from 'next/server';
import { productHuntService } from '@/services/productHunt';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const posts = await productHuntService.getPosts({
      first: searchParams.get('first') ? parseInt(searchParams.get('first')!) : undefined,
      after: searchParams.get('after') || undefined,
      postedBefore: searchParams.get('postedBefore') || undefined,
      postedAfter: searchParams.get('postedAfter') || undefined,
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取数据失败' },
      { status: 500 }
    );
  }
} 
