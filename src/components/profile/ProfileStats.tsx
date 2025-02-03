import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileStatsProps {
  userId: string;
}

export const ProfileStats = ({ userId }: ProfileStatsProps) => {
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    articles: 0
  });
  const { t } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      const [followersData, followingData, articlesData] = await Promise.all([
        supabase
          .from('follows')
          .select('*', { count: 'exact' })
          .eq('following_id', userId),
        supabase
          .from('follows')
          .select('*', { count: 'exact' })
          .eq('follower_id', userId),
        supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
      ]);

      setStats({
        followers: followersData.count || 0,
        following: followingData.count || 0,
        articles: articlesData.count || 0
      });
    };

    fetchStats();
  }, [userId]);

  return (
    <div className="flex gap-6">
      <div>
        <div className="text-2xl font-bold">{stats.followers}</div>
        <div className="text-gray-600">{t("profile.followers")}</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.following}</div>
        <div className="text-gray-600">{t("profile.following")}</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.articles}</div>
        <div className="text-gray-600">{t("profile.posts")}</div>
      </div>
    </div>
  );
};