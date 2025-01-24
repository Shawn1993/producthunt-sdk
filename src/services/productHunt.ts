import { GET_POSTS } from '@/graphql/queries/posts';
import { GET_COLLECTIONS } from '@/graphql/queries/collections';
import { GET_POST_COMMENTS, GET_COMMENT_REPLIES } from '@/graphql/queries/comments';
import type { 
  ProductHuntPost, 
  ProductHuntCollection,
  PostsQueryParams,
  CollectionsQueryParams,
  ProductHuntComment,
  GetPostCommentsResponse,
  GetCommentRepliesResponse
} from '@/types/product-hunt';
import config from '@/config';
import { tokenStorage } from '@/services/tokenStorage';
import { TokenStorage } from '@/services/tokenStorage';

interface Comment extends ProductHuntComment {
  replies?: Comment[];
}

export class ProductHuntService {
  private readonly apiUrl: string;
  private readonly serviceName: string;

  constructor(private readonly tokenStorage: TokenStorage) {
    this.apiUrl = config.api.productHunt.graphqlUrl;
    this.serviceName = config.api.productHunt.serviceName;
  }

  public async graphqlRequest<T>(query: string, variables: Record<string, any>): Promise<T> {
    const token = await this.tokenStorage.getToken(this.serviceName);
    if (!token) {
      throw new Error('No access token found');
    }

    console.log('[ProductHunt] GraphQL Request:', {
      url: this.apiUrl,
      variables,
      hasToken: !!token,
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
        await this.tokenStorage.clearToken(this.serviceName);
        throw new Error('Access token expired');
      }
      throw new Error(`GraphQL request failed: ${response.statusText}`);
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

  async getPost(postId: string): Promise<ProductHuntPost> {
    const GET_POST = `
      query GetPost($id: ID!) {
        post(id: $id) {
          id
          name
          tagline
          commentsCount
          description
          url
          website
          slug
          votesCount
          reviewsCount
          reviewsRating
          createdAt
          featuredAt
        }
      }
    `;

    const response = await this.graphqlRequest<{ post: ProductHuntPost }>(GET_POST, { id: postId });
    if (!response.post) {
      throw new Error('帖子不存在');
    }
    return response.post;
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    try {
      // 1. 获取所有顶级评论
      let hasNextPage = true;
      let after: string | null = null;
      const batchSize = 50;
      let allComments: Comment[] = [];

      while (hasNextPage) {
        const response: GetPostCommentsResponse = await this.graphqlRequest<GetPostCommentsResponse>(GET_POST_COMMENTS, {
          postId,
          first: batchSize,
          after,
        });

        const { comments } = response.post;
        const pageComments = comments.edges.map((edge: { node: ProductHuntComment; cursor: string }) => ({
          ...edge.node,
          replies: [],
        }));
        allComments = allComments.concat(pageComments);

        hasNextPage = comments.pageInfo.hasNextPage;
        after = comments.pageInfo.endCursor;
      }

      // 2. 获取每个评论的回复
      const topLevelComments = allComments.filter(comment => !comment.parentId);
      
      // 并行获取所有评论的回复
      const repliesPromises = topLevelComments.map(async (comment) => {
        let hasMoreReplies = true;
        let repliesAfter: string | null = null;
        const replies: Comment[] = [];

        while (hasMoreReplies) {
          const repliesResponse: GetCommentRepliesResponse = await this.graphqlRequest<GetCommentRepliesResponse>(GET_COMMENT_REPLIES, {
            commentId: comment.id,
            first: batchSize,
            after: repliesAfter,
          });

          const commentReplies = repliesResponse.comment.replies.edges.map(
            (edge: { node: ProductHuntComment; cursor: string }) => edge.node
          );
          replies.push(...commentReplies);

          hasMoreReplies = repliesResponse.comment.replies.pageInfo.hasNextPage;
          repliesAfter = repliesResponse.comment.replies.pageInfo.endCursor;
        }

        return {
          commentId: comment.id,
          replies,
        };
      });

      const repliesResults = await Promise.all(repliesPromises);

      // 3. 将回复添加到对应的评论中
      const commentMap = new Map<string, Comment>();
      topLevelComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      repliesResults.forEach(({ commentId, replies }) => {
        const comment = commentMap.get(commentId);
        if (comment) {
          comment.replies = replies;
        }
      });

      return Array.from(commentMap.values());
    } catch (error) {
      console.error('获取评论失败:', error);
      throw error;
    }
  }
}

export const productHuntService = new ProductHuntService(tokenStorage); 