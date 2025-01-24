import { redirect } from 'next/navigation';
import { productHuntService } from '@/services/productHunt';
import { CollectionsList } from './_components/collections-list';
import { tokenStorage } from '@/services/tokenStorage';
import config from '@/config';

export default async function CollectionsPage() {
  try {
    // 使用正确的方法名 getToken
    const accessToken = await tokenStorage.getToken(config.api.productHunt.serviceName);
    if (!accessToken) {
      // 如果没有令牌，重定向到登录页面
      redirect('/api/auth/producthunt');
    }

    const collections = await productHuntService.getCollections({
      first: 20,
      featured: true
    });

    return (
      <div className="container mx-auto py-8 px-4 space-y-8" suppressHydrationWarning>
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            Product Hunt 合集
          </h1>
          <p className="text-xl text-muted-foreground text-center leading-7">
            发现精选产品合集，探索创新科技和创意工具
          </p>
        </div>

        <CollectionsList initialCollections={collections} />
      </div>
    );
  } catch (error) {
    console.error('Failed to load collections:', error);
    
    // 如果是认证错误，重定向到登录页面
    if (error instanceof Error && 
        (error.message.includes('authenticate') || error.message.includes('token'))) {
      redirect('/api/auth/producthunt');
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto p-4 rounded-lg border border-destructive text-destructive">
          <h2 className="text-lg font-semibold mb-2">加载失败</h2>
          <p className="text-sm">
            {error instanceof Error ? error.message : '获取数据时发生错误，请稍后重试'}
          </p>
        </div>
      </div>
    );
  }
} 