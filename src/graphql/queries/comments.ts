export const GET_POST_COMMENTS = `
  query GetPostComments($postId: ID!, $first: Int, $after: String) {
    post(id: $postId) {
      id
      comments(first: $first, after: $after, order: NEWEST) {
        edges {
          node {
            id
            body
            createdAt
            votesCount
            isVoted
            parentId
            user {
              id
              name
              username
              profileImage
              headline
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const GET_COMMENT_REPLIES = `
  query GetCommentReplies($commentId: ID!, $first: Int, $after: String) {
    comment(id: $commentId) {
      id
      replies(first: $first, after: $after, order: NEWEST) {
        edges {
          node {
            id
            body
            createdAt
            votesCount
            isVoted
            parentId
            user {
              id
              name
              username
              profileImage
              headline
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`; 