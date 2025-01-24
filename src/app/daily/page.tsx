import { DailyPosts } from './_components/daily-posts';

export default function DailyPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          今日最佳产品
        </h1>
        <p className="text-xl text-muted-foreground text-center leading-7">
          发现并探索 Product Hunt 上最新最热门的产品
        </p>
      </div>

      <DailyPosts />
    </div>
  );
} 