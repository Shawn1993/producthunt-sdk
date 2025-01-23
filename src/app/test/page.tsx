'use client';

import { useEffect, useState } from 'react';
import { ProductHuntPost } from '@/services/productHunt';

export default function TestPage() {
  const [posts, setPosts] = useState<ProductHuntPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchPosts = async (postedAfter: string) => {
    try {
      console.log('开始获取数据, 日期:', postedAfter);
      setLoading(true);
      const res = await fetch(`/api/product-hunt/daily?postedAfter=${postedAfter}`);
      const data = await res.json();
      console.log('获取到的数据:', data);
      setPosts(data.posts);
    } catch (err) {
      console.error('获取数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      console.log('数据获取完成');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('日期变更:', date);
    fetchPosts(date);
  }, [date]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            console.log('选择新日期:', e.target.value);
            setDate(e.target.value);
          }}
          className="border p-2 rounded"
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Product Hunt 日榜</h1>
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