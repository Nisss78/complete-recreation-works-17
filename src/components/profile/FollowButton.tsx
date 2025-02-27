
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const FollowButton = ({ targetUserId }: { targetUserId: string }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuthAndFollowStatus = async () => {
      // ログインステータスの確認
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      setUserId(currentUserId);

      if (!currentUserId) {
        setIsLoading(false);
        return;
      }

      // フォロー状態の確認
      try {
        const { data, error } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle();

        if (error) throw error;
        setIsFollowing(!!data);
      } catch (error) {
        console.error('Error checking follow status:', error);
        toast({
          title: t("error.unauthorized"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFollowStatus();
  }, [targetUserId, toast, t]);

  const handleFollowToggle = async () => {
    if (!userId) {
      toast({
        title: t("follow.loginRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // フォロー解除
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', userId)
          .eq('following_id', targetUserId);

        if (error) throw error;
        setIsFollowing(false);
        toast({
          title: t("success.unfollowed"),
        });
      } else {
        // フォロー
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: userId,
            following_id: targetUserId,
          });

        if (error) throw error;
        setIsFollowing(true);
        toast({
          title: t("success.followed"),
        });
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
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
      onClick={handleFollowToggle}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? t("follow.following") : t("follow.button")}
    </Button>
  );
};
