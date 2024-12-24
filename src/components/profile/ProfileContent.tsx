import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FollowButton } from "@/components/articles/FollowButton";

interface ProfileContentProps {
  userId: string;
  isOwnProfile: boolean;
}

export const ProfileContent = ({ userId, isOwnProfile }: ProfileContentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      return data;
    },
    enabled: !!userId,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
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

  if (profileLoading || articlesLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-white/50 rounded-xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <ProfileHeader profile={profile} />
        {!isOwnProfile && (
          <div className="absolute top-6 right-6">
            <FollowButton profileId={userId} />
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">投稿した記事</h2>
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
              showDeleteButton={isOwnProfile}
              onDelete={handleArticleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            まだ記事を投稿していません
          </div>
        )}
      </div>
    </div>
  );
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