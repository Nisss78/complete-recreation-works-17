import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

interface BookmarkedArticle {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string | null;
  likes_count: number;
  created_at: string;
  user_id: string;
  updated_at: string;
  profiles: Profile;
}

export const useAllArticleBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }

        const { data: bookmarksData, error } = await supabase
          .from('article_bookmarks')
          .select(`
            article_id,
            articles (
              id,
              title,
              content,
              thumbnail_url,
              likes_count,
              user_id,
              created_at,
              updated_at,
              profiles (
                id,
                username,
                avatar_url
              )
            )
          `)
          .eq('user_id', session.session.user.id);

        if (error) {
          throw error;
        }

        if (bookmarksData) {
          const articles = bookmarksData
            .map(b => b.articles)
            .filter((article): article is BookmarkedArticle => article !== null);
          setBookmarks(articles);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        toast({
          title: "Error fetching bookmarks",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [toast]);

  return {
    bookmarks,
    isLoading,
  };
};