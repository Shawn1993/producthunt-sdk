export const GET_COLLECTIONS = `
  query GetCollections($first: Int, $after: String, $featured: Boolean) {
    collections(first: $first, after: $after, featured: $featured) {
      edges {
        node {
          id
          name
          description
          url
          coverImage
          followersCount
          posts {
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