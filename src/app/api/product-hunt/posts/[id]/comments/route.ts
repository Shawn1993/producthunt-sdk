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
    const comments = await productHuntService.getPostComments(params.id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    return new NextResponse('获取评论失败', { status: 500 });
  }
} 