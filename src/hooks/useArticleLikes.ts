import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useArticleLikes = (articleId: number) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    checkIfLiked();
    fetchLikesCount();
  }, [articleId]);

  const checkIfLiked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: like } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    setHasLiked(!!like);
  };

  const fetchLikesCount = async () => {
    const { data: likes } = await supabase
      .from('article_likes')
      .select('id', { count: 'exact' })
      .eq('article_id', articleId);

    setLikesCount(likes?.length || 0);
  };

  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "いいねをするにはログインしてください",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasLiked) {
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', session.user.id);

        setLikesCount(prev => Math.max(0, prev - 1));
        setHasLiked(false);

        toast({
          title: "いいねを取り消しました",
          description: "記事のいいねを取り消しました",
        });
      } else {
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: session.user.id
          });

        if (error?.code === '23505') {
          // If duplicate, just ignore
          return;
        }

        if (error) throw error;

        setLikesCount(prev => prev + 1);
        setHasLiked(true);

        toast({
          title: "いいね！",
          description: "記事にいいねしました",
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "エラーが発生しました",
        description: "操作に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return {
    hasLiked,
    likesCount,
    handleLike
  };
};