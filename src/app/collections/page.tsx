import { CollectionsList } from './_components/collections-list';

export default function CollectionsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Product Hunt 合集
        </h1>
        <p className="text-xl text-muted-foreground text-center leading-7">
          发现精选产品合集，探索创新科技和创意工具
        </p>
      </div>

      <CollectionsList />
    </div>
  );
} 