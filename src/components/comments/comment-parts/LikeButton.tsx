import { ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <button 
      className={`flex items-center gap-1 transition-colors ${
        hasLiked 
          ? 'text-blue-500 hover:text-blue-600' 
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
      onClick={handleLike}
    >
      <ThumbsUp className="w-4 h-4" />
      <span>{t('comments.likeCount').replace('{count}', String(totalLikes))}</span>
    </button>
  );
};