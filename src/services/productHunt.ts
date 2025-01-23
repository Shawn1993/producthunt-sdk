import { tokenStorage } from './tokenStorage';
import config from '@/config';

export interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  description: string;
  thumbnail: {
    url: string;
  };
  votesCount: number;
  website: string;
  slug: string;
  topics: {
    edges: Array<{
      node: {
        name: string;
      };
    }>;
  };
}

export interface ProductHuntResponse {
  data?: {
    posts: {
      edges: Array<{
        node: ProductHuntPost;
      }>;
    };
  };
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export interface ProductHuntCollection {
  id: string;
  name: string;
  description: string;
  posts: {
    edges: Array<{
      node: ProductHuntPost;
    }>;
  };
  coverImage: string;
  followersCount: number;
  url: string;
}

const GET_DAILY_POSTS = `
  query GetDailyPosts($postedAfter: DateTime) {
    posts(first: 10, postedAfter: $postedAfter, order: RANKING) {
      edges {
        node {
          id
          name
          tagline
          description
          thumbnail {
            url
          }
          votesCount
          website
          slug
          topics {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const GET_COLLECTIONS = `
  query GetCollections($first: Int, $featured: Boolean) {
    collections(first: $first, featured: $featured, order: FOLLOWERS_COUNT) {
      edges {
        node {
          id
          name
          description
          coverImage
          followersCount
          url
          posts(first: 3) {
            edges {
              node {
                id
                name
                tagline
                thumbnail {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getDailyPosts(postedAfter: string): Promise<ProductHuntPost[]> {
  console.log('开始获取 Product Hunt 日榜数据, 日期:', postedAfter);
  try {
    const token = await tokenStorage.getToken(config.api.productHunt.serviceName);
    console.log('成功获取 token');

    const response = await fetch(config.api.productHunt.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_DAILY_POSTS,
        variables: { postedAfter },
      }),
    });

    const data: ProductHuntResponse = await response.json();
    console.log('获取到响应数据');

    if (data.errors) {
      console.error('GraphQL 请求返回错误:', data.errors);
      throw new Error(data.errors[0].message);
    }

    const posts = data.data?.posts.edges.map(edge => edge.node) ?? [];
    console.log(`成功获取 ${posts.length} 条数据`);
    return posts;
  } catch (err) {
    console.error('获取 Product Hunt 日榜失败:', err);
    if (err instanceof Error) {
      console.error('错误详情:', err.message);
    }
    throw err instanceof Error ? err : new Error('获取 Product Hunt 日榜失败');
  }
}

export async function getCollections(featured: boolean = true): Promise<ProductHuntCollection[]> {
  try {
    const token = await tokenStorage.getToken(config.api.productHunt.serviceName);
    
    const response = await fetch(config.api.productHunt.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_COLLECTIONS,
        variables: { 
          first: 10,
          featured 
        },
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data.collections.edges.map((edge: any) => edge.node);
  } catch (err) {
    console.error('获取 Collections 失败:', err);
    throw err;
  }
} 