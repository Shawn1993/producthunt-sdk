import { notFound } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowUpCircle, MessageCircle } from 'lucide-react';
import { productHuntService } from '@/services/productHunt';
import type { ProductHuntComment } from '@/types/product-hunt';

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

export default async function CommentsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const post = await productHuntService.getPost(params.id);
    const comments = await productHuntService.getPostComments(params.id);

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
  } catch (error) {
    console.error('加载评论页面失败:', error);
    notFound();
  }
} 