'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ExternalLink, ThumbsUp, MessageSquare, Star, Calendar, Hash, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Masonry from 'react-masonry-css';
import type { ProductHuntPost } from '@/types/product-hunt';
import type { DateRange } from "react-day-picker";

export function DailyPosts() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const [posts, setPosts] = useState<{
    node: ProductHuntPost;
    cursor: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({from: yesterday, to: today});
  const [limit, setLimit] = useState<string>("10");

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  // 监听日期和数量变化，获取数据
  useEffect(() => {
    if (dateRange?.from && dateRange?.to && parseInt(limit) > 0) {
      fetchPosts();
    }
  }, [dateRange, limit]);

  async function fetchPosts() {
    // 确保 dateRange.from 和 dateRange.to 存在
    if (!dateRange.from || !dateRange.to) return;

    try {
      setLoading(true);
      // 直接使用日期字符串，避免时区转换
      const start = dateRange.from.toISOString().split('T')[0] + 'T00:00:00Z';
      const end = dateRange.to.toISOString().split('T')[0] + 'T23:59:59Z';

      const response = await fetch(
        `/api/product-hunt/posts?` + 
        `postedAfter=${start}&` +
        `postedBefore=${end}&` +
        `first=${parseInt(limit) || 10}`
      );
      
      const data = await response.json();
      setPosts(data.edges);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4 text-destructive text-center">
        <p className="text-lg font-medium">错误</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 justify-center items-end">
        <div className="space-y-2">
          <Label>日期范围</Label>
          <DatePickerWithRange 
            date={dateRange}
            onSelect={(range) => {
              setDateRange(range || dateRange);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>显示数量</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="100"
              value={limit}
              onChange={(e) => {
                const value = e.target.value;
                setLimit(value);
              }}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">个</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(parseInt(limit)).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          {posts.map(({ node: post }) => (
            <Card key={post.id} className="mb-6 group overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-bold">
                    <Link 
                      href={post.url}
                      target="_blank"
                      className="hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {post.name}
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">{post.tagline}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {post.topics.edges.map(({ node: topic }) => (
                      <Badge key={topic.id} variant="secondary" className="text-xs">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {post.thumbnail && (
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img 
                      src={post.thumbnail.url} 
                      alt={post.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>

                {post.commentsCount > 0 && (
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link 
                      href={`${post.url}#comments`}
                      target="_blank"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      查看 {post.commentsCount} 条评论
                    </Link>
                  </Button>
                )}
              </CardContent>

              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.votesCount}</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentsCount}</span>
                </div>
                
                {post.reviewsCount > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>{post.reviewsRating.toFixed(1)} ({post.reviewsCount})</span>
                  </div>
                )}
                
                <Button variant="ghost" size="sm" asChild className="w-full col-span-2">
                  <Link href={post.website} target="_blank">
                    访问网站
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Masonry>
      )}
    </div>
  );
} 