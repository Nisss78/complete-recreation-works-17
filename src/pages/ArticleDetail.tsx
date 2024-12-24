import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import type { Article } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const ArticleDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      console.log('Fetching article details for id:', id);
      const { data: article, error } = await supabase
        .from('articles')
        .select(`
          *,
          profile:profiles!articles_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }

      return article;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (article) {
      setLikesCount(article.likes_count || 0);
      checkIfLiked();
    }
  }, [article]);

  const checkIfLiked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: like } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', Number(id))
      .eq('user_id', session.user.id)
      .maybeSingle();

    setHasLiked(!!like);
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
        // いいねを削除
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', Number(id))
          .eq('user_id', session.user.id);

        setLikesCount(prev => Math.max(0, prev - 1));
        setHasLiked(false);

        toast({
          title: "いいねを取り消しました",
          description: "記事のいいねを取り消しました",
        });
      } else {
        // いいねを追加
        await supabase
          .from('article_likes')
          .insert({
            article_id: Number(id),
            user_id: session.user.id
          });

        setLikesCount(prev => prev + 1);
        setHasLiked(true);

        toast({
          title: "いいね！",
          description: "記事にいいねしました",
        });
      }

      // 記事のいいね数を更新
      await supabase
        .from('articles')
        .update({ likes_count: likesCount })
        .eq('id', id);

    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "エラーが発生しました",
        description: "操作に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading article...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Article not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto py-8 px-4">
          <ArticleHeader 
            title={article.title}
            author={{
              name: article.profile.username || "Unknown User",
              avatar: article.profile.avatar_url || "/placeholder.svg"
            }}
            postedAt={new Date(article.created_at).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
            likes={likesCount}
            hasLiked={hasLiked}
            onLike={handleLike}
            thumbnailUrl={article.thumbnail_url}
          />

          <div className="prose prose-gray max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;