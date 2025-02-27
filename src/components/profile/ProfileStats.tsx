
import { useState, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface ProfileStatsProps {
  userId: string;
}

export const ProfileStats = ({ userId }: ProfileStatsProps) => {
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [posts, setPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // フォロワー取得
        const { data: followersData, error: followersError } = await supabase
          .from('follows')
          .select(`
            follower:profiles!follows_follower_id_fkey (
              id,
              username,
              avatar_url
            )
          `)
          .eq('following_id', userId);

        if (followersError) throw followersError;

        // フォロー中取得
        const { data: followingData, error: followingError } = await supabase
          .from('follows')
          .select(`
            following:profiles!follows_following_id_fkey (
              id,
              username,
              avatar_url
            )
          `)
          .eq('follower_id', userId);

        if (followingError) throw followingError;

        // 投稿数取得
        const { count, error: postsError } = await supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .eq('user_id', userId);

        if (postsError) throw postsError;

        setFollowers(followersData.map(item => item.follower));
        setFollowing(followingData.map(item => item.following));
        setPosts(count || 0);
      } catch (error) {
        console.error('Error fetching profile stats:', error);
        toast({
          title: t("error.fetchProfile"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, toast, t]);

  if (loading) {
    return (
      <div className="flex gap-4 justify-around">
        <div className="animate-pulse h-5 w-16 bg-gray-200 rounded" />
        <div className="animate-pulse h-5 w-16 bg-gray-200 rounded" />
        <div className="animate-pulse h-5 w-16 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-around py-4 border-y border-gray-200">
      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="flex flex-col items-center hover:bg-gray-50 px-4 py-2 rounded-lg">
            <span className="font-semibold">{posts}</span>
            <span className="text-gray-600 text-sm">{t("profile.posts")}</span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t("profile.posts")}</h4>
            {posts === 0 && <p className="text-sm text-gray-500">{t("articles.noPosts")}</p>}
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="flex flex-col items-center hover:bg-gray-50 px-4 py-2 rounded-lg">
            <span className="font-semibold">{followers.length}</span>
            <span className="text-gray-600 text-sm">{t("profile.followers")}</span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t("profile.followers")}</h4>
            {followers.length === 0 ? (
              <p className="text-sm text-gray-500">まだフォロワーがいません</p>
            ) : (
              <div className="space-y-2">
                {followers.map((follower) => (
                  <div key={follower.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={follower.avatar_url} />
                      <AvatarFallback>{getInitials(follower.username || '')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{follower.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="flex flex-col items-center hover:bg-gray-50 px-4 py-2 rounded-lg">
            <span className="font-semibold">{following.length}</span>
            <span className="text-gray-600 text-sm">{t("profile.following")}</span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t("profile.following")}</h4>
            {following.length === 0 ? (
              <p className="text-sm text-gray-500">まだ誰もフォローしていません</p>
            ) : (
              <div className="space-y-2">
                {following.map((followed) => (
                  <div key={followed.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={followed.avatar_url} />
                      <AvatarFallback>{getInitials(followed.username || '')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{followed.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
