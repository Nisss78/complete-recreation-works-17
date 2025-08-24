
import { MessageCircle, Star, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SparkleEffect } from "@/components/ui/sparkle-effect";

interface ProductActionsProps {
  productId: number;
  productName: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  isAuthenticated: boolean;
  onLike: () => Promise<void>;
  isMobile: boolean;
  onCommentClick: () => void;
}

export function ProductActions({
  productId,
  productName,
  likes,
  comments,
  hasLiked,
  isAuthenticated,
  onLike,
  isMobile,
  onCommentClick
}: ProductActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthRequired = () => {
    toast({
      title: "ログインが必要です",
      description: "この機能を使用するにはログインしてください",
    });
    navigate("/auth");
  };

  const handleInteraction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      handleAuthRequired();
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onLike();
  };


  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCommentClick();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${window.location.origin}/products/${slug}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "リンクをコピーしました",
        description: "クリップボードにURLをコピーしました",
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast({
        title: "コピーに失敗しました",
        description: "URLのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <SparkleEffect>
        <Button 
          variant={hasLiked ? "like-button" : "like-button-outline"}
          size="sm"
          onClick={handleLike}
          className="flex items-center gap-1 sm:gap-2 rounded-full px-3 sm:px-4"
        >
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-sm sm:text-base font-medium">{likes}</span>
        </Button>
      </SparkleEffect>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={handleCommentClick}
        className="flex items-center gap-1 sm:gap-2 rounded-full"
      >
        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-sm sm:text-base font-medium">{comments}</span>
      </Button>

      {!isMobile && (
        <Button 
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="p-1.5 sm:p-2 rounded-full h-9 w-9"
        >
          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      )}
    </div>
  );
}
