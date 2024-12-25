import { Heart, Trash2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useArticleBookmarks } from "@/hooks/useArticleBookmarks";
import { Avatar } from "@/components/ui/avatar";

interface Author {
  id: string;
  name: string;
  blog?: string;
  avatar: string;
}

interface ArticleFooterProps {
  author: Author;
  postedAt: string;
  likes: number;
  hasLiked: boolean;
  showDeleteButton?: boolean;
  onLike: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onAuthorClick: (e: React.MouseEvent) => void;
  articleId: number;
}

export const ArticleFooter = ({
  author,
  postedAt,
  likes,
  hasLiked,
  showDeleteButton,
  onLike,
  onDelete,
  onAuthorClick,
  articleId
}: ArticleFooterProps) => {
  const { isBookmarked, toggleBookmark } = useArticleBookmarks(articleId);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleBookmark();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button 
          onClick={onAuthorClick}
          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
        >
          <img 
            src={author.avatar}
            alt={author.name}
            className="w-6 h-6 rounded-full object-cover cursor-pointer"
          />
          <span className="text-sm text-gray-600 hover:text-gray-900">{author.name}</span>
        </button>
        <span className="text-gray-400 text-sm">{postedAt}</span>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onLike}
          className={cn(
            "flex items-center gap-1 transition-colors",
            hasLiked 
              ? "text-pink-500 hover:text-pink-600" 
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
          <span>{likes}</span>
        </button>
        <button
          onClick={handleBookmark}
          className={cn(
            "flex items-center gap-1 transition-colors p-1",
            isBookmarked
              ? "text-blue-500 hover:text-blue-600"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
        </button>
        {showDeleteButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 sm:p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};