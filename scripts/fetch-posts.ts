import { productHuntService } from '../src/services/productHunt';
import { sql } from '@vercel/postgres';
import { GET_POST_COMMENTS } from '../src/graphql/queries/comments';
import { GetPostCommentsResponse, ProductHuntPost, ProductHuntComment } from '../src/types/product-hunt';

async function batchInsertComments(comments: ProductHuntComment[], postId: string) {
  try {
    const values = comments.map(comment => ({
      id: comment.id,
      post_id: postId,
      body: comment.body,
      votes_count: comment.votesCount,
      is_voted: comment.isVoted,
      created_at: new Date(comment.createdAt).toISOString(),
      user_id: comment.user.id,
      user_name: comment.user.name,
      user_headline: comment.user.headline || null,
      user_profile_image: comment.user.profileImage,
      raw_data: JSON.stringify(comment)
    }));

    // 构建批量插入的 SQL 语句
    const columns = Object.keys(values[0]);
    const placeholders = values.map((_, i) => 
      `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
    ).join(', ');
    
    const flatValues = values.flatMap(obj => Object.values(obj));
    
    await sql.query(`
      INSERT INTO comments (${columns.join(', ')})
      VALUES ${placeholders}
      ON CONFLICT (id, post_id) DO UPDATE SET
        votes_count = EXCLUDED.votes_count,
        is_voted = EXCLUDED.is_voted,
        raw_data = EXCLUDED.raw_data,
        fetched_at = CURRENT_TIMESTAMP
    `, flatValues);

    console.log(`批量保存 ${comments.length} 条评论完成`);
  } catch (error) {
    console.error('批量保存评论失败:', error);
    throw error;
  }
}

async function fetchAndSaveComments(postId: string) {
  try {
    let hasNextPage = true;
    let after: string | null = null;
    const batchSize = 50;
    let allComments: ProductHuntComment[] = [];

    while (hasNextPage) {
      const response: GetPostCommentsResponse = await productHuntService.graphqlRequest<GetPostCommentsResponse>(GET_POST_COMMENTS, {
        postId,
        first: batchSize,
        after,
      });

      const { comments } = response.post;
      
      // 收集这一页的评论
      const pageComments = comments.edges.map(edge => edge.node);
      allComments = allComments.concat(pageComments);

      hasNextPage = comments.pageInfo.hasNextPage;
      after = comments.pageInfo.endCursor;
    }

    // 批量保存所有评论
    if (allComments.length > 0) {
      await batchInsertComments(allComments, postId);
    }

    console.log(`获取帖子 ${postId} 的评论完成，共 ${allComments.length} 条评论`);
  } catch (error) {
    console.error(`获取帖子 ${postId} 的评论失败:`, error);
  }
}

async function batchInsertPosts(posts: ProductHuntPost[]) {
  try {
    const values = posts.map(post => ({
      id: post.id,
      name: post.name,
      tagline: post.tagline,
      description: post.description,
      url: post.url,
      website: post.website,
      slug: post.slug,
      votes_count: post.votesCount,
      comments_count: post.commentsCount,
      reviews_count: post.reviewsCount,
      reviews_rating: post.reviewsRating,
      created_at: new Date(post.createdAt).toISOString(),
      featured_at: post.featuredAt ? new Date(post.featuredAt).toISOString() : null,
      thumbnail_url: post.thumbnail?.url || null,
      topics: JSON.stringify(post.topics),
      raw_data: JSON.stringify(post)
    }));

    // 构建批量插入的 SQL 语句
    const columns = Object.keys(values[0]);
    const placeholders = values.map((_, i) => 
      `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
    ).join(', ');
    
    const flatValues = values.flatMap(obj => Object.values(obj));
    
    await sql.query(`
      INSERT INTO posts (${columns.join(', ')})
      VALUES ${placeholders}
      ON CONFLICT (id) DO UPDATE SET
        votes_count = EXCLUDED.votes_count,
        comments_count = EXCLUDED.comments_count,
        reviews_count = EXCLUDED.reviews_count,
        reviews_rating = EXCLUDED.reviews_rating,
        raw_data = EXCLUDED.raw_data,
        fetched_at = CURRENT_TIMESTAMP
    `, flatValues);

    console.log(`批量保存 ${posts.length} 个帖子完成`);
  } catch (error) {
    console.error('批量保存帖子失败:', error);
    throw error;
  }
}

async function fetchAndSavePosts() {
  try {
    console.log('开始获取帖子...');
    
    // 获取昨天的日期范围
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const start = yesterday.toISOString().split('T')[0] + 'T00:00:00Z';
    const end = yesterday.toISOString().split('T')[0] + 'T23:59:59Z';

    // 获取帖子
    const posts = await productHuntService.getPosts({
      first: 50,  // 获取更多帖子
      postedAfter: start,
      postedBefore: end,
    });

    const allPosts = posts.edges.map((edge: { node: ProductHuntPost }) => edge.node);
    console.log(`获取到 ${allPosts.length} 个帖子`);

    // 批量保存帖子
    await batchInsertPosts(allPosts);

    // 获取每个帖子的评论
    for (const post of allPosts) {
      if (post.commentsCount > 0) {
        await fetchAndSaveComments(post.id);
      }
    }

    console.log('完成！');
  } catch (error) {
    console.error('获取或保存帖子时出错:', error);
    process.exit(1);
  }
}

// 运行脚本
fetchAndSavePosts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  }); 