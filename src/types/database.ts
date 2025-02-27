
export interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  avatar_position?: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  other_url: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  language_preference?: string;
  streak_count?: number;
}

export interface Comment {
  id: number;
  content: string;
  user_id: string;
  product_id: number;
  parent_id: number | null;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string | null;
  likes_count?: number;
}
