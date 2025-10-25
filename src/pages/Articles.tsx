
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingLogos from "@/components/FloatingLogos";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-white relative overflow-hidden">
          <FloatingParticles />
          <FloatingLogos />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 md:pt-32 relative z-10">
            <h1 className="text-6xl font-bold mb-4 text-left" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ARTICLES
            </h1>
            <p className="text-base md:text-lg text-gray-700 text-left">
              {t('articles.title')}
            </p>
          </div>
        </div>

        <div className="py-6 sm:py-8">
        <div className="max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-3 sm:space-y-4">

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 sm:h-32 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-2">
              {articles.map((article) => (
                <div key={article.id}>
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
            <div className="text-center py-6 sm:py-8 text-gray-500 bg-white rounded-lg shadow-sm">
              {t('articles.noArticles')}
            </div>
          )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
