import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && !profileId) {
        navigate("/auth");
        return;
      }
      setUserId(session?.user.id || null);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && !profileId) {
        navigate("/auth");
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, profileId]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", profileId || userId],
    queryFn: async () => {
      const targetId = profileId || userId;
      if (!targetId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!(profileId || userId),
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["userArticles", profileId || userId],
    queryFn: async () => {
      const targetId = profileId || userId;
      if (!targetId) return [];

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
        .eq('user_id', targetId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!(profileId || userId),
  });

  const handleArticleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ["userArticles"] });
  };

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

  const isOwnProfile = !profileId || profileId === userId;

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

  const targetId = profileId || userId;
  if (!targetId || !profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <ProfileHeader 
            profileId={targetId}
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
                    id: article.profile.id,
                    name: article.profile.username,
                    avatar: article.profile.avatar_url
                  }}
                  likes={article.likes_count || 0}
                  postedAt={formatTimeAgo(article.created_at)}
                  thumbnail_url={article.thumbnail_url}
                  showDeleteButton={isOwnProfile}
                  onDelete={handleArticleDelete}
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

export default ProfilePage;