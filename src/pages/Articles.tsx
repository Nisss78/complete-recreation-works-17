
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Articles() {
  const { t, language } = useLanguage();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const query = supabase
        .from('articles')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      return data.map(article => ({
        ...article,
        profiles: {
          id: article.profiles.id,
          username: article.profiles.username || "Unknown User",
          avatar_url: article.profiles.avatar_url || "/placeholder.svg"
        }
      }));
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
    
    if (language === 'ja') {
      return `${diffInDays}日前`;
    }
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto py-4 sm:container sm:px-4">
        <div className="space-y-3 sm:space-y-4 px-0">
          <div className="px-3 sm:px-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('articles.title')}
            </h1>
          </div>

          {isLoading ? (
            <div className="space-y-2 px-3 sm:px-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 sm:h-32 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-2">
              {articles.map((article) => (
                <div key={article.id} className="px-0">
                  <ArticleCard
                    id={article.id}
                    date={formatDate(article.created_at)}
                    title={article.title}
                    author={{
                      id: article.profiles.id,
                      name: article.profiles.username,
                      avatar: article.profiles.avatar_url
                    }}
                    likes={article.likes_count || 0}
                    postedAt={formatTimeAgo(article.created_at)}
                    thumbnail_url={article.thumbnail_url}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 bg-white rounded-lg shadow-sm mx-3 sm:mx-0">
              {t('articles.noArticles')}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
