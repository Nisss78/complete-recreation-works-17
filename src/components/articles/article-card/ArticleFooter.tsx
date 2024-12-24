import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FollowButton } from "@/components/articles/FollowButton";

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
}

export const ArticleFooter = ({
  author,
  postedAt,
  likes,
  hasLiked,
  showDeleteButton,
  onLike,
  onDelete,
  onAuthorClick
}: ArticleFooterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2 flex-1">
        <button 
          onClick={onAuthorClick}
          className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
        >
          <img 
            src={author.avatar}
            alt=""
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="truncate max-w-[120px] sm:max-w-none">{author.name}</span>
          {author.blog && (
            <>
              <span className="text-gray-400 hidden sm:inline">in</span>
              <span className="hidden sm:inline">{author.blog}</span>
            </>
          )}
        </button>
        <div className="text-gray-400 text-xs sm:text-sm">{postedAt}</div>
      </div>

      <div className="flex items-center gap-2">
        <FollowButton profileId={author.id} className="h-8" />
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