import { GET_POSTS } from '@/graphql/queries/posts';
import { GET_COLLECTIONS } from '@/graphql/queries/collections';
import type { 
  ProductHuntPost, 
  ProductHuntCollection,
  PostsQueryParams,
  CollectionsQueryParams 
} from '@/types/product-hunt';
import config from '@/config';
import { tokenStorage } from '@/services/tokenStorage';

class ProductHuntService {
  private async graphqlRequest<T>(query: string, variables: Record<string, any>): Promise<T> {
    try {
      // 使用正确的方法名 getToken，并传入服务名称
      const accessToken = await tokenStorage.getToken(config.api.productHunt.serviceName);
      
      if (!accessToken) {
        throw new Error('No access token available. Please authenticate first.');
      }

      console.log('[ProductHunt] GraphQL Request:', {
        url: config.api.productHunt.graphqlUrl,
        variables,
        hasToken: !!accessToken,
      });

      const response = await fetch(config.api.productHunt.graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // accessToken 直接就是字符串
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        cache: 'no-store', // 禁用缓存以确保获取最新数据
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 使用正确的方法名 clearToken
          await tokenStorage.clearToken(config.api.productHunt.serviceName);
          throw new Error('Access token expired. Please authenticate again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error('[ProductHunt] GraphQL Errors:', JSON.stringify(data.errors, null, 2));
        throw new Error(
          Array.isArray(data.errors) 
            ? data.errors.map((e: { message: string }) => e.message).join(', ')
            : 'Unknown GraphQL error'
        );
      }

      if (!data.data) {
        console.error('[ProductHunt] No data in response:', data);
        throw new Error('No data returned from GraphQL API');
      }

      return data.data;
    } catch (error) {
      console.error('[ProductHunt] Request failed:', error);
      throw error;
    }
  }

  async getCollections(params: CollectionsQueryParams) {
    try {
      console.log('[ProductHunt] Getting collections with params:', params);
      const { first = 20, after, featured } = params;
      const data = await this.graphqlRequest<{ collections: any }>(GET_COLLECTIONS, {
        first,
        after,
        featured,
      });
      
      if (!data.collections) {
        throw new Error('No collections data returned');
      }

      console.log('[ProductHunt] Retrieved collections count:', data.collections?.edges?.length || 0);
      return data.collections;
    } catch (error) {
      console.error('[ProductHunt] Failed to get collections:', error);
      throw error;
    }
  }

  async getPosts(params: PostsQueryParams) {
    try {
      console.log('[ProductHunt] Getting posts with params:', params);
      const { first = 20, after, postedBefore, postedAfter } = params;
      const data = await this.graphqlRequest<{ posts: any }>(GET_POSTS, {
        first,
        after,
        postedBefore,
        postedAfter,
      });

      if (!data.posts) {
        throw new Error('No posts data returned');
      }

      console.log('[ProductHunt] Retrieved posts count:', data.posts?.edges?.length || 0);
      return data.posts;
    } catch (error) {
      console.error('[ProductHunt] Failed to get posts:', error);
      throw error;
    }
  }
}

export const productHuntService = new ProductHuntService(); 