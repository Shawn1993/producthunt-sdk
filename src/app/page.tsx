import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Lock } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6 flex flex-col items-center space-y-12 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700">
            Product Hunt SDK
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            一个强大且易用的 Product Hunt API 集成工具，助力您的产品快速对接 Product Hunt 平台
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg border shadow-sm">
            <div className="p-2 bg-primary/10 rounded-full">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">安全可靠</h3>
            <p className="text-sm text-muted-foreground text-center">
              内置安全认证机制，确保您的数据安全
            </p>
          </div>
          {/* 可以添加更多特性卡片 */}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link href="/api/auth/producthunt">
              登录 Product Hunt
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="secondary">
            <Link href="/test">
              查看示例
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link href="https://github.com/yourusername/producthunt-sdk" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
} 