
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { SparkleEffect } from "@/components/ui/sparkle-effect";

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
    <SparkleEffect>
      <Button 
        variant={hasLiked ? "like-button" : "ghost"}
        size="sm"
        className={`h-auto py-1 px-2 ${
          hasLiked 
            ? 'text-white' 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        onClick={handleLike}
      >
        <Star className="w-4 h-4 mr-1" />
        <span>{t('comments.likeCount').replace('{count}', String(totalLikes))}</span>
      </Button>
    </SparkleEffect>
  );
};
