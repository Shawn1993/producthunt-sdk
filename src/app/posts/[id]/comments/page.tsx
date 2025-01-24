'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowUpCircle, MessageCircle } from 'lucide-react';
import type { ProductHuntComment, ProductHuntPost } from '@/types/product-hunt';

interface Comment extends ProductHuntComment {
  replies?: Comment[];
}

function CommentCard({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className={`${isReply ? 'ml-8 mt-4' : 'mb-4'}`}>
      <Card className="p-4 hover:bg-accent/50 transition-colors">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <img 
              src={comment.user.profileImage} 
              alt={comment.user.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm">{comment.user.name}</h3>
              {comment.user.headline && (
                <span className="text-muted-foreground text-sm truncate">
                  {comment.user.headline}
                </span>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap mb-2">{comment.body}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ArrowUpCircle className="w-4 h-4" />
                <span>{comment.votesCount}</span>
              </div>
              {comment.replies && comment.replies.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comment.replies.length}</span>
                </div>
              )}
              <time>
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </time>
            </div>
          </div>
        </div>
      </Card>
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}

async function fetchPost(postId: string): Promise<ProductHuntPost> {
  const response = await fetch(`/api/product-hunt/posts/${postId}`);
  if (!response.ok) {
    throw new Error('获取帖子失败');
  }
  return response.json();
}

async function fetchComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`/api/product-hunt/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error('获取评论失败');
  }
  return response.json();
}

export default function CommentsPage() {
  const params = useParams();
  const [post, setPost] = useState<ProductHuntPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const postId = params.id as string;
        const [postData, commentsData] = await Promise.all([
          fetchPost(postId),
          fetchComments(postId),
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        console.error('加载评论页面失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent rounded w-3/4"></div>
          <div className="h-4 bg-accent rounded w-1/2"></div>
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-accent rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center text-destructive">
          <h1 className="text-2xl font-bold mb-2">出错了</h1>
          <p>{error || '找不到该帖子'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{post.name}</h1>
        <p className="text-muted-foreground">{post.tagline}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          评论 ({post.commentsCount})
        </h2>
        <ScrollArea className="h-[calc(100vh-300px)]">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
} 