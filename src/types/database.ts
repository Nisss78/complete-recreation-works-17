export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  credits?: number;
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
  profile?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    credits?: number;
  };
  profiles: {
    id: string;
    username: string;
    avatar_url: string;
    credits?: number;
  };
}