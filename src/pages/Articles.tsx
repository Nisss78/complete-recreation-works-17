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
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);
  const { t } = useLanguage();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", showFollowedOnly],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      let query = supabase
        .from('articles')
        .select(`
          *,
          profile:profiles!articles_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (showFollowedOnly && session.session) {
        const { data: followedUsers } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', session.session.user.id);

        const followedIds = followedUsers?.map(f => f.following_id) || [];
        
        if (followedIds.length > 0) {
          query = query.in('user_id', followedIds);
        } else {
          return [];
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      return data.map(article => ({
        ...article,
        profiles: {
          id: article.profile.id,
          username: article.profile.username || "Unknown User",
          avatar_url: article.profile.avatar_url || "/placeholder.svg"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-4 px-2 sm:px-4">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('articles.title')}
            </h1>
            <div className="flex gap-2">
              <Button
                variant={showFollowedOnly ? "outline" : "default"}
                onClick={() => setShowFollowedOnly(false)}
                className="flex-1 sm:flex-none text-sm sm:text-base px-3 py-1.5"
              >
                {t('articles.all')}
              </Button>
              <Button
                variant={showFollowedOnly ? "default" : "outline"}
                onClick={() => setShowFollowedOnly(true)}
                className="flex-1 sm:flex-none text-sm sm:text-base px-3 py-1.5"
              >
                {t('articles.following')}
              </Button>
            </div>
          </div>

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
              {articles.map((article: Article) => (
                <ArticleCard
                  key={article.id}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 bg-white rounded-lg shadow-sm">
              {showFollowedOnly ? t('articles.noFollowingArticles') : t('articles.noArticles')}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}