
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
        // 記事数を取得
        const { count, error: postsError } = await supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .eq('user_id', userId);

        if (postsError) throw postsError;
        setPosts(count || 0);

        // フォロワーとフォロー中の関連テーブルが存在しない場合を考慮
        const checkFollowsTable = async () => {
          try {
            // followsテーブルが存在するか確認
            const { error: followsError } = await supabase
              .from('follows')
              .select('id')
              .limit(1);

            if (followsError) {
              console.log("Follows table might not exist or is not accessible:", followsError);
              setFollowers([]);
              setFollowing([]);
              return false;
            }
            return true;
          } catch (error) {
            console.error("Error checking follows table:", error);
            return false;
          }
        };

        const followsTableExists = await checkFollowsTable();
        
        if (followsTableExists) {
          // フォロワー取得
          const { data: followersData } = await supabase
            .from('follows')
            .select('follower_id')
            .eq('following_id', userId);

          // フォロワーのプロフィール情報を取得
          if (followersData && followersData.length > 0) {
            const followerIds = followersData.map(item => item.follower_id);
            const { data: followerProfiles } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', followerIds);
              
            setFollowers(followerProfiles || []);
          } else {
            setFollowers([]);
          }

          // フォロー中取得
          const { data: followingData } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', userId);

          // フォロー中のプロフィール情報を取得
          if (followingData && followingData.length > 0) {
            const followingIds = followingData.map(item => item.following_id);
            const { data: followingProfiles } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', followingIds);
              
            setFollowing(followingProfiles || []);
          } else {
            setFollowing([]);
          }
        }
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

    if (userId) {
      fetchStats();
    }
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
              <p className="text-sm text-gray-500">{t("profile.noFollowers")}</p>
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
              <p className="text-sm text-gray-500">{t("profile.noFollowing")}</p>
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
