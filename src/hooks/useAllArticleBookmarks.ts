import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/database';
import { useToast } from './use-toast';

export const useAllArticleBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
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
              created_at,
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
          setBookmarks(bookmarksData.map(b => b.articles).filter(Boolean));
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