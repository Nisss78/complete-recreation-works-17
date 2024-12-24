import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFollow = (profileId: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        if (!profileId) {
          setIsLoading(false);
          return;
        }

        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }

        const { data: follow } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', session.session.user.id)
          .eq('following_id', profileId)
          .single();

        setIsFollowing(!!follow);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [profileId]);

  const toggleFollow = async () => {
    try {
      if (!profileId) {
        console.error('Profile ID is undefined');
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "エラー",
          description: "フォローするにはログインが必要です",
          variant: "destructive",
        });
        return;
      }

      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', session.session.user.id)
          .eq('following_id', profileId);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "フォロー解除",
          description: "フォローを解除しました",
        });
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: session.session.user.id,
            following_id: profileId,
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "フォロー完了",
          description: "フォローしました",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "エラー",
        description: "操作に失敗しました",
        variant: "destructive",
      });
    }
  };

  return { isFollowing, isLoading, toggleFollow };
};