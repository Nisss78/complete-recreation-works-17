import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useBookmarks = (productId?: number) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
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

        const { data: bookmarksData } = await supabase
          .from('product_bookmarks')
          .select(`
            product_id,
            products (
              id,
              name,
              tagline,
              icon_url
            )
          `);

        if (bookmarksData) {
          setBookmarks(bookmarksData.map(b => b.products));
          if (productId) {
            setIsBookmarked(bookmarksData.some(b => b.product_id === productId));
          }
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [productId]);

  const toggleBookmark = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "ログインが必要です",
          description: "ブックマーク機能を使用するにはログインしてください",
        });
        return false;
      }

      if (!productId) return false;

      if (isBookmarked) {
        const { error } = await supabase
          .from('product_bookmarks')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', session.session.user.id);

        if (error) throw error;
        setIsBookmarked(false);
        setBookmarks(bookmarks.filter(b => b.id !== productId));
      } else {
        const { error } = await supabase
          .from('product_bookmarks')
          .insert({
            product_id: productId,
            user_id: session.session.user.id,
          });

        if (error) throw error;
        setIsBookmarked(true);
      }

      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  };

  return {
    isBookmarked,
    bookmarks,
    isLoading,
    toggleBookmark,
  };
};