import { Link } from "react-router-dom";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FollowButton } from "../FollowButton";

interface ArticleHeaderProps {
  id: number;
  title: string;
  thumbnail_url?: string | null;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  postedAt: string;
  likes: number;
  hasLiked: boolean;
  isBookmarked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onBookmark: (e: React.MouseEvent) => void;
  onAuthorClick: (e: React.MouseEvent) => void;
}

export const ArticleHeader = ({ 
  id, 
  title, 
  thumbnail_url,
  author,
  postedAt,
  likes,
  hasLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onAuthorClick
}: ArticleHeaderProps) => {
  const { isAuthenticated } = useAuth();
  
  const defaultThumbnails = [
    'photo-1649972904349-6e44c42644a7',
    'photo-1488590528505-98d2b5aba04b',
    'photo-1518770660439-4636190af475',
    'photo-1461749280684-dccba630e2f6',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1581091226825-a6a2a5aee158',
    'photo-1485827404703-89b55fcc595e',
    'photo-1526374965328-7f61d4dc18c5',
    'photo-1531297484001-80022131f5a1',
    'photo-1487058792275-0ad4aaf24ca7'
  ];

  const randomThumbnail = defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)];
  const thumbnailUrl = thumbnail_url || `https://images.unsplash.com/${randomThumbnail}?auto=format&fit=crop&w=800&q=80`;

  const truncatedName = author.name.length > 7 
    ? `${author.name.slice(0, 7)}...` 
    : author.name;

  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg shrink-0">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 text-left break-all">
          {title}
        </h2>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <button 
                onClick={onAuthorClick}
                className="flex items-center gap-1.5 group min-w-0"
                title={author.name}
              >
                <img 
                  src={author.avatar}
                  alt={author.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span className="text-sm text-gray-600 truncate group-hover:text-gray-900">
                  {truncatedName}
                </span>
              </button>
              {isAuthenticated && (
                <FollowButton profileId={author.id} className="ml-2" />
              )}
            </div>
            <span className="text-gray-400 text-xs sm:text-sm shrink-0">{postedAt}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={onLike}
              className={cn(
                "flex items-center gap-1 transition-colors p-1",
                hasLiked 
                  ? "text-pink-500 hover:text-pink-600" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
              <span className="text-sm">{likes}</span>
            </button>
            <button
              onClick={onBookmark}
              className={cn(
                "flex items-center transition-colors p-1",
                isBookmarked
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};