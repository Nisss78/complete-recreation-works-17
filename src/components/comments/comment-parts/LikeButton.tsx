import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedLikeButton } from "./AnimatedLikeButton";

interface LikeButtonProps {
  totalLikes: number;
  hasLiked: boolean;
  onLike: () => Promise<boolean>;
}

export const LikeButton = ({ totalLikes, hasLiked, onLike }: LikeButtonProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: t('comment.loginRequired'),
        description: t('comment.loginRequired.description'),
        variant: "destructive",
      });
      return;
    }

    const success = await onLike();
    if (success) {
      toast({
        title: hasLiked ? t('comment.like.unliked') : t('comment.like.liked'),
        description: hasLiked 
          ? t('comment.like.unliked.description')
          : t('comment.like.liked.description'),
      });
    }
  };

  return (
    <AnimatedLikeButton
      hasLiked={hasLiked}
      totalLikes={totalLikes}
      onLike={handleLike}
    />
  );
};