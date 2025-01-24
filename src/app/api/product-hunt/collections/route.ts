import { NextResponse } from 'next/server';
import { productHuntService } from '@/services/productHunt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const collections = await productHuntService.getCollections({
      first: 20,
      featured
    });
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { error: '获取 Collections 失败' },
      { status: 500 }
    );
  }
} 