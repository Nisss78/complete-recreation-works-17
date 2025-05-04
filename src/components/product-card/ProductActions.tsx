
import { MessageCircle, Star, Share2, Bookmark, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";
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
}

export function ProductActions({
  productId,
  productName,
  likes,
  comments,
  hasLiked,
  isAuthenticated,
  onLike,
  isMobile
}: ProductActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isBookmarked, toggleBookmark } = useBookmarks(productId);

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
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    await onLike();
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    const success = await toggleBookmark();
    if (success) {
      toast({
        title: isBookmarked ? "ブックマークを解除しました" : "ブックマークに追加しました",
        description: isBookmarked 
          ? `${productName}のブックマークを解除しました` 
          : `${productName}をブックマークに追加しました`,
      });
    }
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
        onClick={(e) => handleInteraction(e, 'comment')}
        className="flex items-center gap-1 sm:gap-2 rounded-full"
      >
        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-sm sm:text-base font-medium">{comments}</span>
      </Button>

      {!isMobile && (
        <>
          <Button 
            variant={isBookmarked ? "secondary" : "outline"}
            size="icon"
            onClick={handleBookmark}
            className={`p-1.5 sm:p-2 rounded-full h-9 w-9 ${
              isBookmarked ? "text-blue-500 border-blue-500" : ""
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>

          <Button 
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-full h-9 w-9"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>

          <Button 
            variant="outline"
            size="icon"
            onClick={(e) => handleInteraction(e, 'stats')}
            className="p-1.5 sm:p-2 rounded-full h-9 w-9"
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
