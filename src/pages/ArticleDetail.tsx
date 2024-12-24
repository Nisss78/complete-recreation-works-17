import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import type { Article } from "@/types/database";

const ArticleDetail = () => {
  const { id } = useParams();
  
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
            likes={article.likes_count || 0}
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