import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useArticleLikes } from "@/hooks/useArticleLikes";
import { MetaTags } from "@/components/MetaTags";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { ArticleContent } from "./article-detail/ArticleContent";
import { ArticleHeader } from "./article-detail/ArticleHeader";
import { ArticleActions } from "./article-detail/ArticleActions";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const articleId = parseInt(id || "0", 10);
  const { hasLiked, likesCount, handleLike } = useArticleLikes(articleId);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profile:profiles!articles_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq("id", articleId)
        .single();

      if (error) throw error;

      return {
        ...data,
        author: {
          id: data.profile.id,
          name: data.profile.username || "Unknown User",
          avatar: data.profile.avatar_url || "/placeholder.svg",
        },
      };
    },
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "リンクをコピーしました",
        description: "クリップボードにURLをコピーしました",
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast({
        title: "コピーに失敗しました",
        description: "URLのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Header />
        <main className="container max-w-4xl mx-auto py-4 sm:py-8 px-4">
          <div className="space-y-4 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 sm:w-32" />
                <Skeleton className="h-3 w-20 sm:w-24" />
              </div>
            </div>
            <Skeleton className="h-48 sm:h-64 w-full rounded-lg" />
            <div className="space-y-3 sm:space-y-4">
              <Skeleton className="h-6 sm:h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Header />
        <main className="container max-w-4xl mx-auto py-4 sm:py-8 px-4">
          <div className="text-center py-8 sm:py-12">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              記事が見つかりませんでした
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              お探しの記事は削除されたか、URLが間違っている可能性があります。
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {article && (
        <MetaTags 
          title={article.title}
          description={article.content.substring(0, 160)}
          image={article.thumbnail_url || undefined}
        />
      )}
      <Header />
      <main className="container max-w-4xl mx-auto py-4 sm:py-8 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>

        <article className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
          <ArticleHeader article={article} />
          <ArticleActions 
            article={article}
            hasLiked={hasLiked}
            likesCount={likesCount}
            onLike={handleLike}
            onShare={handleShare}
          />
          <ArticleContent content={article.content} />
        </article>
      </main>
      <Footer />
    </div>
  );
}