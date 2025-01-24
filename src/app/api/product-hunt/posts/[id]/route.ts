import { NextRequest, NextResponse } from 'next/server';
import { productHuntService } from '@/services/productHunt';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  _req: NextRequest,
  { params }: Props
) {
  try {
    const post = await productHuntService.getPost(params.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error('获取帖子失败:', error);
    return new NextResponse('获取帖子失败', { status: 500 });
  }
} 