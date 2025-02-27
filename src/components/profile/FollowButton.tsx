
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFollow } from "@/hooks/useFollow";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FollowButtonProps {
  targetUserId: string;
}

export const FollowButton = ({ targetUserId }: FollowButtonProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { isFollowing, toggleFollow, isLoading } = useFollow(targetUserId);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };

    getCurrentUser();
  }, []);

  const handleFollow = async () => {
    try {
      await toggleFollow();
      if (!isFollowing) {
        toast({
          title: t("success.followed"),
        });
      } else {
        toast({
          title: t("success.unfollowed"),
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: t("error.occurred"),
        variant: "destructive",
      });
    }
  };

  // 自分自身のプロフィールの場合はボタンを表示しない
  if (currentUserId === targetUserId) {
    return null;
  }

  // ログインしていない場合はボタンを無効化
  if (!currentUserId) {
    return (
      <Button 
        variant="outline" 
        disabled 
        onClick={() => {}}
      >
        {t("profile.follow")}
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        t("profile.unfollow")
      ) : (
        t("profile.follow")
      )}
    </Button>
  );
};
