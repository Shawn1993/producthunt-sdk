export const GET_POST_COMMENTS = `
  query GetPostComments($postId: ID!, $first: Int, $after: String) {
    post(id: $postId) {
      id
      comments(first: $first, after: $after) {
        edges {
          node {
            id
            body
            createdAt
            votesCount
            isVoted
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