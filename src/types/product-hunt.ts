export interface ProductHuntUser {
  id: string;
  name: string;
  username: string;
  profileImage: string;
}

export interface ProductHuntMedia {
  url: string;
  videoUrl: string | null;
  type: string;
}

export interface ProductHuntProductLink {
  url: string;
  type: string;
}

export interface ProductHuntTopic {
  id: string;
  name: string;
  slug: string;
}

export interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  website: string;
  slug: string;
  votesCount: number;
  commentsCount: number;
  reviewsCount: number;
  reviewsRating: number;
  createdAt: string;
  featuredAt: string | null;
  isCollected: boolean;
  isVoted: boolean;
  makers: ProductHuntUser[];
  media: ProductHuntMedia[];
  thumbnail: ProductHuntMedia | null;
  productLinks: ProductHuntProductLink[];
  user: ProductHuntUser;
  topics: {
    edges: {
      node: ProductHuntTopic;
    }[];
  };
}

export interface ProductHuntCollection {
  id: string;
  name: string;
  description: string;
  url: string;
  coverImage: string | null;
  followersCount: number;
  posts: {
    edges: {
      node: ProductHuntPost;
    }[];
  };
}

export interface PaginationParams {
  first?: number;
  after?: string;
  before?: string;
}

export interface PostsQueryParams extends PaginationParams {
  postedBefore?: string;
  postedAfter?: string;
}

export interface CollectionsQueryParams extends PaginationParams {
  featured?: boolean;
} 