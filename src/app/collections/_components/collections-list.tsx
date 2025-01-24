'use client';

import { useState, useEffect } from 'react';
import { ProductHuntCollection } from '@/types/product-hunt';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Users, Package } from "lucide-react";
import Link from 'next/link';

export function CollectionsList() {
  const [collections, setCollections] = useState<{
    node: ProductHuntCollection;
    cursor: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState(true);

  async function fetchCollections(isFeatured: boolean) {
    try {
      setLoading(true);
      const response = await fetch(`/api/product-hunt/collections?featured=${isFeatured}`);
      const data = await response.json();
      setCollections(data.edges);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCollections(featured);
  }, [featured]);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4 text-destructive text-center">
        <p className="text-lg font-medium">错误</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="featured" className="w-full" suppressHydrationWarning>
      <TabsList className="w-full max-w-md mx-auto mb-8 h-11 rounded-lg bg-muted p-1">
        <TabsTrigger 
          value="featured"
          className="w-1/2 rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          onClick={() => {
            setFeatured(true);
          }}
        >
          精选合集
        </TabsTrigger>
        <TabsTrigger 
          value="all"
          className="w-1/2 rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          onClick={() => {
            setFeatured(false);
          }}
        >
          全部合集
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[calc(100vh-24rem)] w-full rounded-lg border bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            collections.map(({ node: collection }) => (
              <Card key={collection.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-muted">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between group">
                    <span className="line-clamp-1 text-lg font-semibold">
                      <Link 
                        href={collection.url}
                        target="_blank"
                        className="hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {collection.name}
                        <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      </Link>
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                    {collection.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {collection.coverImage && (
                    <div className="relative h-48 overflow-hidden rounded-lg">
                      <img 
                        src={collection.coverImage} 
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {collection.posts.edges.slice(0, 3).map(({ node: post }) => (
                      <div key={post.id} className="col-span-2 first:col-span-2">
                        <Link 
                          href={`https://www.producthunt.com/posts/${post.slug}`}
                          target="_blank"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 line-clamp-1"
                        >
                          {post.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{collection.followersCount.toLocaleString()} 关注</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-medium">{collection.posts.edges.length} 产品</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Tabs>
  );
} 