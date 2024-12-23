import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProductLikes = (productId: number) => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Get total likes count
        const { count: likesCount } = await supabase
          .from('product_likes')
          .select('id', { count: 'exact' })
          .eq('product_id', productId);
        
        setTotalLikes(likesCount || 0);

        // Check if current user has liked
        if (session) {
          const { data: userLike } = await supabase
            .from('product_likes')
            .select('id')
            .eq('product_id', productId)
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setHasLiked(!!userLike);
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikesData();

    // Subscribe to realtime updates for likes
    const channel = supabase
      .channel('product-likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_likes',
          filter: `product_id=eq.${productId}`
        },
        () => {
          fetchLikesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  const toggleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    try {
      if (!hasLiked) {
        const { error } = await supabase
          .from('product_likes')
          .insert({
            product_id: productId,
            user_id: session.user.id
          });

        if (error) throw error;
        setTotalLikes(prev => prev + 1);
        setHasLiked(true);
        return true;
      } else {
        const { error } = await supabase
          .from('product_likes')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', session.user.id);

        if (error) throw error;
        setTotalLikes(prev => prev - 1);
        setHasLiked(false);
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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