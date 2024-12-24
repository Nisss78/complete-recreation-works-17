import { Heart, Share2 } from "lucide-react";

interface ArticleActionsProps {
  article: {
    created_at: string;
  };
  hasLiked: boolean;
  likesCount: number;
  onLike: () => void;
  onShare: () => void;
}

export const ArticleActions = ({ 
  article, 
  hasLiked, 
  likesCount, 
  onLike, 
  onShare 
}: ArticleActionsProps) => {
  return (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b">
      <time className="text-sm text-gray-500">
        {new Date(article.created_at).toLocaleDateString('ja-JP')}
      </time>
      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={onShare}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          シェア
        </button>
        <button
          onClick={onLike}
          className={`flex items-center gap-2 text-sm sm:text-base ${
            hasLiked ? "text-pink-500" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${hasLiked ? "fill-current" : ""}`} />
          {likesCount}
        </button>
      </div>
    </div>
  );
};