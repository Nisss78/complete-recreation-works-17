import { MessageCircle, ArrowUp, Share2, Bookmark, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProductActionsProps {
  productId: number;
  productName: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  isAuthenticated: boolean;
  onLike: () => Promise<void>;
}

export function ProductActions({
  productId,
  productName,
  likes,
  comments,
  hasLiked,
  isAuthenticated,
  onLike
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
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    await onLike();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${window.location.origin}/posts/${productSlug}`;
    
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
    <div className="flex items-center gap-3">
      <button 
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          hasLiked 
            ? "text-upvote border-upvote" 
            : "text-gray-700 hover:text-upvote border-gray-200 hover:border-upvote"
        }`}
        onClick={handleLike}
      >
        <ArrowUp className="w-4 h-4" />
        <span className="font-medium">{likes}</span>
      </button>
      
      <button 
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
        onClick={(e) => handleInteraction(e, 'comment')}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="font-medium">{comments}</span>
      </button>

      <button 
        className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
        onClick={(e) => handleInteraction(e, 'bookmark')}
      >
        <Bookmark className="w-4 h-4" />
      </button>

      <button 
        className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
      </button>

      <button 
        className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
        onClick={(e) => handleInteraction(e, 'stats')}
      >
        <BarChart2 className="w-4 h-4" />
      </button>
    </div>
  );
}