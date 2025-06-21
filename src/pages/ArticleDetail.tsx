import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Heart, ArrowLeft, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useArticleLikes } from "@/hooks/useArticleLikes";
import { useArticleBookmarks } from "@/hooks/useArticleBookmarks";
import { Button } from "@/components/ui/button";
import { ArticleContent } from "./article-detail/ArticleContent";
import { ArticleHeader } from "./article-detail/ArticleHeader";
import { ArticleActions } from "./article-detail/ArticleActions";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const articleId = parseInt(id || "0", 10);
  const { hasLiked, likesCount, handleLike } = useArticleLikes(articleId);
  const { isBookmarked, toggleBookmark } = useArticleBookmarks(articleId);

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

  const handleBookmark = async () => {
    const success = await toggleBookmark();
    if (success) {
      toast({
        title: isBookmarked ? "ブックマークを解除しました" : "ブックマークに追加しました",
        description: isBookmarked 
          ? "記事のブックマークを解除しました" 
          : "記事をブックマークに追加しました",
      });
    }
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

  // OGP画像とメタタグの設定
  const ogpImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ogp?type=article&title=${encodeURIComponent(article.title)}&author=${encodeURIComponent(article.author.name)}`;
  const articleUrl = window.location.href;
  const description = article.content.substring(0, 150).replace(/[#*]/g, '') + '...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Helmet>
        <title>{`${article.title} | Protoduct`}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogpImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Protoduct" />
        <meta property="article:author" content={article.author.name} />
        <meta property="article:published_time" content={article.created_at} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogpImageUrl} />
      </Helmet>
      <Header />
      <main className="container max-w-4xl mx-auto py-4 sm:py-8 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('article.details.back')}
        </Button>

        {/* SNSシェアボタン */}
        <div className="flex gap-3 mb-4">
          {/* X（Twitter） */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(`${article.title} | Protoduct`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
          >
            Xでシェア
          </a>
        </div>

        <article className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
          <ArticleHeader article={article} />
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <time className="text-sm text-gray-500">
              {t('article.details.postedOn').replace('{date}', new Date(article.created_at).toLocaleDateString())}
            </time>
            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('article.details.share')}
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm sm:text-base ${
                  hasLiked ? "text-pink-500" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${hasLiked ? "fill-current" : ""}`} />
                {likesCount}
              </button>
              <button
                onClick={handleBookmark}
                className={cn(
                  "flex items-center gap-2 text-sm sm:text-base p-1",
                  isBookmarked
                    ? "text-blue-500 hover:text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Bookmark className={cn("w-4 h-4 sm:w-5 sm:h-5", isBookmarked && "fill-current")} />
              </button>
            </div>
          </div>
          <ArticleContent content={article.content} />
        </article>
      </main>
      <Footer />
    </div>
  );
}