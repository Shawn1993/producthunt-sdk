CREATE TABLE IF NOT EXISTS access_tokens (
  id SERIAL PRIMARY KEY,
  service_name VARCHAR(50) NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(service_name)
);

CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  url TEXT NOT NULL,
  website TEXT,
  slug VARCHAR(255) NOT NULL,
  votes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  reviews_rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  featured_at TIMESTAMP WITH TIME ZONE,
  thumbnail_url TEXT,
  topics JSONB,
  raw_data JSONB,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(50) PRIMARY KEY,
  post_id VARCHAR(50) NOT NULL REFERENCES posts(id),
  body TEXT NOT NULL,
  votes_count INTEGER DEFAULT 0,
  is_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_headline TEXT,
  user_profile_image TEXT,
  raw_data JSONB,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id, post_id)
); 