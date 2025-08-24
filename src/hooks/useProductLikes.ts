import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  getBrowserIdentifier, 
  isItemLikedLocally, 
  saveLocalLike, 
  removeLocalLike 
} from "@/utils/browserIdentifier";

export const useProductLikes = (productId: number) => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // ログインユーザーのいいね数を取得
        const { count: loggedInLikes } = await supabase
          .from('product_likes')
          .select('id', { count: 'exact' })
          .eq('product_id', productId);

        // 匿名ユーザーのいいね数を取得
        const { count: anonymousLikes } = await supabase
          .from('anonymous_product_likes')
          .select('id', { count: 'exact' })
          .eq('product_id', productId);
        
        // 両方のいいね数を合計
        const totalCount = (loggedInLikes || 0) + (anonymousLikes || 0);
        setTotalLikes(totalCount);

        // ユーザーがいいね済みかチェック
        if (session) {
          // ログインユーザーの場合
          const { data: userLike } = await supabase
            .from('product_likes')
            .select('id')
            .eq('product_id', productId)
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setHasLiked(!!userLike);
        } else {
          // 匿名ユーザーの場合
          const identifier = getBrowserIdentifier();
          const { data: anonymousLike } = await supabase
            .from('anonymous_product_likes')
            .select('id')
            .eq('product_id', productId)
            .eq('identifier', identifier)
            .maybeSingle();
          
          // データベースとローカルストレージの両方を確認
          setHasLiked(!!anonymousLike || isItemLikedLocally('product', productId));
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikesData();

    // リアルタイムでいいねの更新を監視
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

    try {
      if (session) {
        // ログインユーザーの処理
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
      } else {
        // 匿名ユーザーの処理
        const identifier = getBrowserIdentifier();
        
        if (!hasLiked) {
          // いいねする
          const { error } = await supabase
            .from('anonymous_product_likes')
            .insert({
              product_id: productId,
              identifier: identifier
            });

          if (error?.code === '23505') {
            // 既にいいね済みの場合
            toast({
              title: "既にいいね済みです",
              description: "この製品は既にいいねしています",
              variant: "destructive",
            });
            return false;
          }

          if (error) throw error;
          
          saveLocalLike('product', productId);
          setTotalLikes(prev => prev + 1);
          setHasLiked(true);
          return true;
        } else {
          // いいねを取り消す
          const { error } = await supabase
            .from('anonymous_product_likes')
            .delete()
            .eq('product_id', productId)
            .eq('identifier', identifier);

          if (error) throw error;
          
          removeLocalLike('product', productId);
          setTotalLikes(prev => prev - 1);
          setHasLiked(false);
          return true;
        }
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