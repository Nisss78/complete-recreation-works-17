import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useFollow = (profileId: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

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
          .maybeSingle();

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
          title: t('error.occurred'),
          description: t('follow.loginRequired'),
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
          title: t('success.completed'),
          description: t('follow.unfollowed'),
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
          title: t('success.completed'),
          description: t('follow.success'),
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: t('error.occurred'),
        description: t('error.tryAgain'),
        variant: "destructive",
      });
    }
  };

  return { isFollowing, isLoading, toggleFollow };
};