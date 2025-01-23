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
    authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
  },
});

export async function getDailyPosts(): Promise<ProductHuntPost[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await graphQLClient.request<ProductHuntResponse>(GET_DAILY_POSTS, {
      postedAfter: today.toISOString(),
    });

    return data.posts.edges.map(edge => edge.node);
  } catch (error) {
    console.error('获取 Product Hunt 日榜失败:', error);
    throw error;
  }
} 