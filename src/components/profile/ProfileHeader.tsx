import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { FollowButton } from "@/components/profile/FollowButton";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileSocialLinks } from "@/components/profile/ProfileSocialLinks";
import { getInitials } from "@/lib/utils";

interface ProfileHeaderProps {
  profileId: string;
  isOwnProfile: boolean;
  onAvatarUpdate?: (url: string) => void;
}

export const ProfileHeader = ({ profileId, isOwnProfile, onAvatarUpdate }: ProfileHeaderProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: t("error.fetchProfile"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, toast, t]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t("success.loggedOut")
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{getInitials(profile.username || '')}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">
            {profile.username || t("profile.noUsername")}
          </h1>
          {profile.bio && (
            <p className="text-gray-600 mt-1 line-clamp-2">{profile.bio}</p>
          )}
        </div>

        <div className="flex gap-2 self-stretch sm:self-center">
          {isOwnProfile ? (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/settings")}
              >
                {t("profile.edit")}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <FollowButton targetUserId={profileId} />
          )}
        </div>
      </div>

      <ProfileStats userId={profileId} />
      
      {(profile.twitter_url || profile.instagram_url || profile.github_url || profile.other_url) && (
        <ProfileSocialLinks profile={profile} />
      )}
    </div>
  );
};