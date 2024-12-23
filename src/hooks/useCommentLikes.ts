import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCommentLikes = (commentId: number) => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Get total likes count
        const { count: likesCount } = await supabase
          .from('comment_likes')
          .select('id', { count: 'exact' })
          .eq('comment_id', commentId);
        
        setTotalLikes(likesCount || 0);

        // Check if current user has liked
        if (session) {
          const { data: userLike } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', commentId)
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setHasLiked(!!userLike);
        }
      } catch (error) {
        console.error('Error fetching comment likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikesData();

    // リアルタイムでいいねの更新を監視
    const channel = supabase
      .channel('comment-likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_likes',
          filter: `comment_id=eq.${commentId}`
        },
        () => {
          console.log('Comment like update detected for comment:', commentId);
          fetchLikesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [commentId]);

  const toggleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    try {
      if (!hasLiked) {
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: session.user.id
          });

        if (error) throw error;
        setTotalLikes(prev => prev + 1);
        setHasLiked(true);
        return true;
      } else {
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', session.user.id);

        if (error) throw error;
        setTotalLikes(prev => prev - 1);
        setHasLiked(false);
        return true;
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return false;
    }
  };

  return {
    totalLikes,
    hasLiked,
    isLoading,
    toggleLike
  };
};