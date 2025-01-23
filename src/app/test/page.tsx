'use client';

import { useEffect, useState } from 'react';
import { ProductHuntPost } from '@/services/productHunt';

export default function TestPage() {
  const [posts, setPosts] = useState<ProductHuntPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/product-hunt/daily')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Hunt 今日榜单</h1>
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{post.name}</h2>
            <p className="text-gray-600">{post.tagline}</p>
            <div className="mt-2">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {post.votesCount} 票
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 