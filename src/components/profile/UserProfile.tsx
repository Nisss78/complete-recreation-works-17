import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";

export const UserProfile = () => {
  const { userId } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    checkAuth();
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: articles, isLoading: articlesLoading, refetch: refetchArticles } = useQuery({
    queryKey: ["userArticles", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profile:profiles!articles_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(article => ({
        ...article,
        profiles: {
          id: article.profile.id,
          username: article.profile.username || "Unknown User",
          avatar_url: article.profile.avatar_url || "/placeholder.svg"
        }
      }));
    },
    enabled: !!userId,
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

  const isOwnProfile = userId === currentUserId;

  if (profileLoading || articlesLoading) {
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

  if (!userId || !profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <ProfileHeader 
            profileId={userId}
            isOwnProfile={isOwnProfile}
          />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{t("articles.myPosts")}</h2>
            {articles && articles.length > 0 ? (
              articles.map((article) => (
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
                  showDeleteButton={isOwnProfile}
                  onDelete={() => refetchArticles()}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {t("articles.noPosts")}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};