import { ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LikeButtonProps {
  totalLikes: number;
  hasLiked: boolean;
  onLike: () => Promise<boolean>;
}

export const LikeButton = ({ totalLikes, hasLiked, onLike }: LikeButtonProps) => {
  const { toast } = useToast();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "いいねをするにはログインしてください",
        variant: "destructive",
      });
      return;
    }

    const success = await onLike();
    if (success) {
      toast({
        title: hasLiked ? "いいねを取り消しました" : "いいね！",
        description: hasLiked ? "コメントのいいねを取り消しました" : "コメントにいいねしました",
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
      <span>いいね ({totalLikes})</span>
    </button>
  );
};