
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileHeaderProps {
  profileId: string;
  isOwnProfile: boolean;
  onAvatarUpdate?: (url: string) => void;
}

export const ProfileHeader = ({ profileId, isOwnProfile, onAvatarUpdate }: ProfileHeaderProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-400/30 to-blue-400/30 h-24 sm:h-32" />
      <div className="px-4 sm:px-6 py-4 sm:py-6 -mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 mb-4">
          <HoverCard>
            <HoverCardTrigger>
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-sm">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-xl">{getInitials(profile.username || '')}</AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold">{profile.username || t("profile.noUsername")}</h4>
                <p className="text-sm text-gray-500">登録日: {new Date(profile.created_at).toLocaleDateString()}</p>
                {profile.bio && <p className="text-sm">{profile.bio}</p>}
              </div>
            </HoverCardContent>
          </HoverCard>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">
              {profile.username || t("profile.noUsername")}
            </h1>
            {profile.bio && (
              <p className="text-gray-600 mt-1 line-clamp-2">{profile.bio}</p>
            )}
          </div>

          <div className="flex gap-2 self-stretch sm:self-end mt-2 sm:mt-0">
            {isOwnProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("profile.edit")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profile.edit")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("nav.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <FollowButton targetUserId={profileId} />
            )}
          </div>
        </div>

        <ProfileStats userId={profileId} />
        
        {(profile.twitter_url || profile.instagram_url || profile.github_url || profile.other_url) && (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="mt-4"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                {t("profile.social")}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ProfileSocialLinks profile={profile} />
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};
