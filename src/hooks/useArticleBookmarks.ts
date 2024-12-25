import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useArticleBookmarks = (articleId: number) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfBookmarked();
  }, [articleId]);

  const checkIfBookmarked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: bookmark } = await supabase
      .from('article_bookmarks')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    setIsBookmarked(!!bookmark);
  };

  const toggleBookmark = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "ブックマークするにはログインしてください",
        variant: "destructive",
      });
      return false;
    }

    try {
      if (isBookmarked) {
        await supabase
          .from('article_bookmarks')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', session.user.id);

        setIsBookmarked(false);
        return true;
      } else {
        await supabase
          .from('article_bookmarks')
          .insert({
            article_id: articleId,
            user_id: session.user.id
          });

        setIsBookmarked(true);
        return true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "エラーが発生しました",
        description: "操作に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
      return false;
    }
  };

  return { isBookmarked, toggleBookmark };
};