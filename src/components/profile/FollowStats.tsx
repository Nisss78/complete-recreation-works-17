import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface FollowStatsProps {
  profileId: string;
}

export const FollowStats = ({ profileId }: FollowStatsProps) => {
  const { t } = useLanguage();

  const { data: followersCount = 0 } = useQuery({
    queryKey: ["followers", profileId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: 'exact', head: true })
        .eq("following_id", profileId);

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ["following", profileId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: 'exact', head: true })
        .eq("follower_id", profileId);

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="flex justify-center gap-8 py-4">
      <div className="text-center">
        <div className="text-2xl font-bold">{followersCount}</div>
        <div className="text-sm text-gray-600">{t('profile.followers')}</div>
        {followersCount === 0 && (
          <div className="text-xs text-gray-400">{t('profile.noFollowers')}</div>
        )}
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{followingCount}</div>
        <div className="text-sm text-gray-600">{t('profile.following')}</div>
        {followingCount === 0 && (
          <div className="text-xs text-gray-400">{t('profile.noFollowing')}</div>
        )}
      </div>
    </div>
  );
};