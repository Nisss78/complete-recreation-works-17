
import { Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparkleEffect } from "@/components/ui/sparkle-effect";

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
        <Button
          onClick={onShare}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
          シェア
        </Button>
        
        <SparkleEffect>
          <Button
            onClick={onLike}
            variant={hasLiked ? "like-button" : "like-button-outline"}
            size="sm"
            className="rounded-full"
          >
            <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${hasLiked ? "fill-current" : ""} mr-1`} />
            {likesCount}
          </Button>
        </SparkleEffect>
      </div>
    </div>
  );
};
