import { NextResponse } from 'next/server';
import { getCollections } from '@/services/productHunt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const collections = await getCollections(featured);
    return NextResponse.json({ collections });
  } catch (error) {
    return NextResponse.json(
      { error: '获取 Collections 失败' },
      { status: 500 }
    );
  }
} 