import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Product Hunt SDK
      </h1>
      <p className="text-xl mb-8">
        一个简单的 Product Hunt API 集成工具
      </p>
      <div className="flex gap-4">
        <Link 
          href="/api/auth/producthunt" 
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          登录 Product Hunt
        </Link>
        <Link 
          href="/test" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          查看示例
        </Link>
        <Link 
          href="https://github.com/yourusername/producthunt-sdk" 
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
          target="_blank"
        >
          GitHub
        </Link>
      </div>
    </main>
  );
} 