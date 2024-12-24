import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        toast({
          title: "エラー",
          description: "プロフィールの取得に失敗しました",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ id: userId }])
          .select()
          .single();

        if (createError) {
          toast({
            title: "エラー",
            description: "プロフィールの作成に失敗しました",
            variant: "destructive",
          });
          throw createError;
        }

        return newProfile;
      }

      return data;
    },
    enabled: !!userId,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["userArticles", userId],
    queryFn: async () => {
      if (!userId) return [];

      console.log("Fetching user articles for:", userId);
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

      if (error) {
        console.error('Error fetching user articles:', error);
        toast({
          title: "エラー",
          description: "記事の取得に失敗しました",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(article => ({
        ...article,
        profiles: {
          id: article.profile?.id,
          username: article.profile?.username || "Unknown User",
          avatar_url: article.profile?.avatar_url || "/placeholder.svg"
        }
      }));
    },
    enabled: !!userId,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <ProfileHeader profile={profile} />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('articles.myPosts')}</h2>
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
                  showDeleteButton={true}
                  onDelete={handleArticleDelete}
                  thumbnail_url={article.thumbnail_url}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {t('articles.noPosts')}
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
