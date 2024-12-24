import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetail() {
  const { id } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
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
        .eq("id", id)
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
          <ArticleHeader
            author={article.author}
            postedAt={article.created_at}
            showFollowButton={true}
          />
          
          {article.thumbnail_url && (
            <div className="mt-6">
              <img
                src={article.thumbnail_url}
                alt=""
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-8">
            {article.title}
          </h1>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}