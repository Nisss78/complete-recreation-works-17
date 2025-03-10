import { MessageCircle, ArrowUp, Share2, Bookmark, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";

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
      <button 
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-colors ${
          hasLiked 
            ? "text-upvote border-upvote" 
            : "text-gray-700 hover:text-upvote border-gray-200 hover:border-upvote"
        }`}
        onClick={handleLike}
      >
        <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-sm sm:text-base font-medium">{likes}</span>
      </button>
      
      <button 
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
        onClick={(e) => handleInteraction(e, 'comment')}
      >
        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-sm sm:text-base font-medium">{comments}</span>
      </button>

      {!isMobile && (
        <>
          <button 
            className={`p-1.5 sm:p-2 rounded-full border transition-colors ${
              isBookmarked
                ? "text-blue-500 border-blue-500"
                : "text-gray-700 hover:text-gray-900 border-gray-200 hover:border-gray-400"
            }`}
            onClick={handleBookmark}
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button 
            className="p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button 
            className="p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            onClick={(e) => handleInteraction(e, 'stats')}
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </>
      )}
    </div>
  );
}
