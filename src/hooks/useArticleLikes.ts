import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "./use-toast";
import { 
  getBrowserIdentifier, 
  isItemLikedLocally, 
  saveLocalLike, 
  removeLocalLike 
} from "../utils/browserIdentifier";

export const useArticleLikes = (articleId: number, initialLikes: number = 0) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { toast } = useToast();

  useEffect(() => {
    checkIfLiked();
    fetchLikesCount();
  }, [articleId]);

  const checkIfLiked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // ログインユーザーの場合
      const { data: like } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      setHasLiked(!!like);
    } else {
      // 匿名ユーザーの場合
      const identifier = getBrowserIdentifier();
      const { data: like } = await supabase
        .from('anonymous_article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('identifier', identifier)
        .maybeSingle();

      // データベースとローカルストレージの両方を確認
      setHasLiked(!!like || isItemLikedLocally('article', articleId));
    }
  };

  const fetchLikesCount = async () => {
    // ログインユーザーのいいね数を取得
    const { count: loggedInLikes } = await supabase
      .from('article_likes')
      .select('id', { count: 'exact' })
      .eq('article_id', articleId);

    // 匿名ユーザーのいいね数を取得
    const { count: anonymousLikes } = await supabase
      .from('anonymous_article_likes')
      .select('id', { count: 'exact' })
      .eq('article_id', articleId);

    // 両方のいいね数を合計
    const totalLikes = (loggedInLikes || 0) + (anonymousLikes || 0);
    setLikesCount(totalLikes || initialLikes);
  };

  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    try {
      if (session) {
        // ログインユーザーの処理
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
            // 重複エラーの場合は無視
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
      } else {
        // 匿名ユーザーの処理
        const identifier = getBrowserIdentifier();
        
        if (hasLiked) {
          // いいねを取り消す
          await supabase
            .from('anonymous_article_likes')
            .delete()
            .eq('article_id', articleId)
            .eq('identifier', identifier);

          removeLocalLike('article', articleId);
          setLikesCount(prev => Math.max(0, prev - 1));
          setHasLiked(false);

          toast({
            title: "いいねを取り消しました",
            description: "記事のいいねを取り消しました",
          });
        } else {
          // いいねする
          const { error } = await supabase
            .from('anonymous_article_likes')
            .insert({
              article_id: articleId,
              identifier: identifier
            });

          if (error?.code === '23505') {
            // 既にいいね済みの場合
            toast({
              title: "既にいいね済みです",
              description: "この記事は既にいいねしています",
              variant: "destructive",
            });
            return;
          }

          if (error) throw error;

          saveLocalLike('article', articleId);
          setLikesCount(prev => prev + 1);
          setHasLiked(true);

          toast({
            title: "いいね！",
            description: "記事にいいねしました",
          });
        }
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