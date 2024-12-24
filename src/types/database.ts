export interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail_url?: string;
  user_id: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}