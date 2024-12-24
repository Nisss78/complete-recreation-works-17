import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/database";

const Articles = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('Fetching articles...');
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      if (!articles) return [];

      return articles.map(article => ({
        ...article,
        profiles: {
          username: article.profiles?.username || "Unknown User",
          avatar_url: article.profiles?.avatar_url || "/placeholder.svg"
        }
      })) as Article[];
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffInDays}日前`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Recent</h1>
          <div className="space-y-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              articles?.map((article) => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  date={formatDate(article.created_at)}
                  title={article.title}
                  author={{
                    name: article.profiles?.username || "Unknown User",
                    avatar: article.profiles?.avatar_url || "/placeholder.svg"
                  }}
                  likes={article.likes_count || 0}
                  postedAt={formatTimeAgo(article.created_at)}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;