export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  other_url: string | null;
  is_admin: boolean | null;
  language_preference: string;
  credits: number;
  streak_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail_url?: string | null;
  user_id: string;
  likes_count: number | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  profiles: Profile;
}