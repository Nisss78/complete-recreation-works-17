import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useArticleLikes } from "@/hooks/useArticleLikes";

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

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${article?.author.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Header />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
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
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              記事が見つかりませんでした
            </h1>
            <p className="text-gray-600">
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
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <article className="bg-white rounded-lg shadow-sm p-8">
          {article.thumbnail_url && (
            <div className="mb-6">
              <img
                src={article.thumbnail_url}
                alt=""
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <button 
              onClick={handleAuthorClick}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <ArticleHeader
                author={article.author}
                postedAt={article.created_at}
                showFollowButton={true}
              />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Share2 className="w-5 h-5" />
                シェア
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 ${
                  hasLiked ? "text-pink-500" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
                {likesCount}
              </button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}