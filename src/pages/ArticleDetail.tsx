import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
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

        if (error) {
          throw error;
        }

        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          title: "エラー",
          description: "記事の取得に失敗しました",
          variant: "destructive",
        });
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Header />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-white/50 rounded-xl" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/50 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto py-8 px-4">
          {article && (
            <ArticleHeader 
              author={{
                id: article.profile.id,
                name: article.profile.username || "Unknown User",
                avatar: article.profile.avatar_url || "/placeholder.svg"
              }}
              postedAt={article.created_at}
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
          <div className="mt-4 text-gray-700">{article.content}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
