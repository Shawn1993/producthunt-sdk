export const GET_POSTS = `
  query GetPosts($first: Int, $after: String, $postedBefore: DateTime, $postedAfter: DateTime) {
    posts(
      first: $first,
      after: $after,
      postedBefore: $postedBefore,
      postedAfter: $postedAfter,
    ) {
      edges {
        node {
          id
          name
          tagline
          description
          url
          website
          slug
          votesCount
          commentsCount
          reviewsCount
          reviewsRating
          createdAt
          featuredAt
          isCollected
          isVoted
          makers {
            id
            name
            username
            profileImage
            headline
          }
          media {
            url
            videoUrl
            type
          }
          thumbnail {
            url
            videoUrl
            type
          }
          productLinks {
            url
            type
          }
          user {
            id
            name
            username
            profileImage
            headline
          }
          topics {
            edges {
              node {
                id
                name
                slug
              }
            }
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
`; 