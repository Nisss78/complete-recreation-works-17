export interface Profile {
  username: string | null;
  avatar_url: string | null;
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
  profiles?: Profile | null;
}