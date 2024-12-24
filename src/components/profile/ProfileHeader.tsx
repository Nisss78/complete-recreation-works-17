import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FollowButton } from "@/components/articles/FollowButton";

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
    streak_count: number;
  } | null;
  showFollowButton?: boolean;
}

export const ProfileHeader = ({ profile, showFollowButton = false }: ProfileHeaderProps) => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: followStats } = useQuery({
    queryKey: ["followStats", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return { following: 0, followers: 0 };

      const [{ count: following }, { count: followers }] = await Promise.all([
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profile.id),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profile.id)
      ]);

      return {
        following: following || 0,
        followers: followers || 0
      };
    },
    enabled: !!profile?.id
  });

  const shouldShowFollowButton = showFollowButton && profile?.id !== session?.user.id;

  if (!profile) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
        <Avatar className="w-24 h-24">
          <AvatarFallback>
            <User className="w-12 h-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">プロフィールを設定してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback>
          <User className="w-12 h-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">{profile.username || "名前未設定"}</h1>
          {shouldShowFollowButton && (
            <FollowButton profileId={profile.id} />
          )}
        </div>
        {profile.bio && (
          <p className="text-muted-foreground max-w-md">{profile.bio}</p>
        )}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-muted-foreground">{profile.streak_count || 0} days streak</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{followStats?.following || 0} フォロー中</span>
            <span>{followStats?.followers || 0} フォロワー</span>
          </div>
        </div>
      </div>
    </div>
  );
};