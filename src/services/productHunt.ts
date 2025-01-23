import { GraphQLClient } from 'graphql-request';

const PRODUCT_HUNT_API_URL = 'https://api.producthunt.com/v2/api/graphql';

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
  posts: {
    edges: Array<{
      node: ProductHuntPost;
    }>;
  };
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

const graphQLClient = new GraphQLClient(PRODUCT_HUNT_API_URL, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
    'Host': 'api.producthunt.com'
  },
});

interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export async function getDailyPosts(): Promise<ProductHuntPost[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('API Token:', process.env.PRODUCT_HUNT_API_TOKEN); // 仅用于调试
    console.log('Request variables:', { postedAfter: today.toISOString() });

    const response = await graphQLClient.request<GraphQLResponse<ProductHuntResponse>>(GET_DAILY_POSTS, {
      postedAfter: today.toISOString(),
    });

    if (response.errors) {
      console.error('GraphQL Errors:', response.errors); // 记录详细错误
      throw new Error(response.errors[0].message);
    }

    return response.data?.posts.edges.map(edge => edge.node) ?? [];
  } catch (err) {
    console.error('获取 Product Hunt 日榜失败:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
    }
    throw err instanceof Error ? err : new Error('获取 Product Hunt 日榜失败');
  }
} 