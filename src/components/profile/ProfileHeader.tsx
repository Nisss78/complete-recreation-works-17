import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/articles/FollowButton";
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  } | null;
  isOwnProfile?: boolean;
  onAvatarUpdate?: (url: string) => void;
  showFollowButton?: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile, onAvatarUpdate, showFollowButton }: ProfileHeaderProps) => {
  const { toast } = useToast();
  const shouldShowFollowButton = showFollowButton && !isOwnProfile && profile;

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

        onAvatarUpdate?.(publicUrl);

        toast({
          title: "アバター画像を更新しました",
          description: "プロフィール画像が正常に更新されました",
        });
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast({
          title: "エラーが発生しました",
          description: "画像のアップロードに失敗しました。もう一度お試しください。",
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
          alt={profile.username || 'プロフィール画像'}
        />
        <AvatarFallback>
          {profile.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">{profile.username || "名前未設定"}</h1>
          {shouldShowFollowButton && (
            <FollowButton profileId={profile.id} />
          )}
        </div>
        {profile.bio && (
          <p className="text-gray-600 max-w-md">{profile.bio}</p>
        )}
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