import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/articles/FollowButton";
import { Link, useNavigate } from "react-router-dom";
import { Github, Twitter, Instagram, Globe, Pencil, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FollowStats } from "./FollowStats";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    github_url?: string | null;
    other_url?: string | null;
    credits?: number;
  } | null;
  isOwnProfile?: boolean;
  onAvatarUpdate?: (url: string) => void;
  showFollowButton?: boolean;
}

export const ProfileHeader = ({ 
  profile, 
  isOwnProfile, 
  onAvatarUpdate,
  showFollowButton 
}: ProfileHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBuyCredits = async () => {
    toast({
      title: t('credits.preparingPurchase'),
      description: t('credits.preparingDesc'),
    });
  };

  const handleAvatarClick = async () => {
    if (!isOwnProfile || !profile) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        onAvatarUpdate?.(publicUrl);

        toast({
          title: t('success.imageUploaded'),
          description: t('success.completed'),
        });
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast({
          title: t('error.occurred'),
          description: t('error.upload'),
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <Avatar 
        className="w-24 h-24 cursor-pointer"
        onClick={handleAvatarClick}
      >
        <AvatarImage 
          src={profile.avatar_url || ''} 
          className="object-cover w-full h-full"
          alt={profile.username || t('profile.noUsername')}
        />
        <AvatarFallback>
          {profile.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">{profile.username || t('profile.noUsername')}</h1>
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="hover:bg-gray-100"
              title={t('profile.edit')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {showFollowButton && (
            <FollowButton profileId={profile.id} />
          )}
        </div>
        {isOwnProfile && (
          <div className="flex items-center justify-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">
              {t('credits.amount', { amount: profile.credits || 0 })}
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {t('credits.buy')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('credits.buy')}</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">{t('credits.monthlyPlan')}</h3>
                    <p className="text-gray-600">{t('credits.monthlyAmount')}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleBuyCredits}
                  >
                    {t('credits.purchase')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {profile.bio && (
          <p className="text-gray-600 max-w-md">{profile.bio}</p>
        )}
        <FollowStats profileId={profile.id} />
        <div className="flex justify-center gap-2 mt-4">
          {profile.twitter_url && (
            <Button variant="ghost" size="icon" asChild>
              <Link to={profile.twitter_url} target="_blank">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {profile.instagram_url && (
            <Button variant="ghost" size="icon" asChild>
              <Link to={profile.instagram_url} target="_blank">
                <Instagram className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {profile.github_url && (
            <Button variant="ghost" size="icon" asChild>
              <Link to={profile.github_url} target="_blank">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {profile.other_url && (
            <Button variant="ghost" size="icon" asChild>
              <Link to={profile.other_url} target="_blank">
                <Globe className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};