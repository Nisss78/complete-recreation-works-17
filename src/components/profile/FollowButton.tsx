import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface FollowButtonProps {
  targetUserId: string;
}

export const FollowButton = ({ targetUserId }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t("error.unauthorized"),
          variant: "destructive",
        });
        return;
      }

      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .match({ follower_id: user.id, following_id: targetUserId });
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: targetUserId });
      }

      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? t("success.unfollowed") : t("success.followed"),
      });
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: t("error.followAction"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isFollowing ? t("profile.unfollow") : t("profile.follow")}
    </Button>
  );
};