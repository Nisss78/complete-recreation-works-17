
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFollow = (targetUserId: string) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      setCurrentUserId(userId);

      if (userId) {
        try {
          // Check if 'follows' table exists
          const { count, error } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId)
            .eq('following_id', targetUserId);

          if (error) {
            console.error('Error checking follow status:', error);
            setIsFollowing(false);
          } else {
            setIsFollowing(count !== null && count > 0);
          }
        } catch (error) {
          console.error('Error checking follow status:', error);
          setIsFollowing(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, [targetUserId]);

  const toggleFollow = async () => {
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);

    try {
      // Check if follows table exists
      const { error: checkError } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true });

      if (checkError) {
        console.error('Follows table might not exist:', checkError);
        // Table doesn't exist, so we can't follow/unfollow
        setIsLoading(false);
        return;
      }

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);
        
        if (error) throw error;
        setIsFollowing(false);
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: targetUserId,
          });
        
        if (error) throw error;
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, toggleFollow, isLoading };
};
