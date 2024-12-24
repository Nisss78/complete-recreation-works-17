import { Heart, Share2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArticleHeaderProps {
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  postedAt: string;
  likes: number;
  hasLiked?: boolean;
  onLike?: () => void;
  thumbnailUrl?: string;
}

export const ArticleHeader = ({ 
  title, 
  author, 
  postedAt, 
  likes,
  hasLiked,
  onLike,
  thumbnailUrl 
}: ArticleHeaderProps) => {
  return (
    <div className="mb-8 space-y-6">
      {thumbnailUrl && (
        <div className="aspect-[1.91/1] relative overflow-hidden rounded-lg">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>
            <User className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-gray-900">
            {author.name}
          </div>
          <div className="text-sm text-gray-500">
            {postedAt}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-y border-gray-100 py-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onLike}
          className={cn(
            "gap-2",
            hasLiked 
              ? "text-pink-500 hover:text-pink-600 hover:bg-pink-50"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <Heart className={cn("w-5 h-5", hasLiked && "fill-current")} />
          <span>{likes}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "gap-2 text-gray-500 hover:text-gray-900",
            "hover:bg-gray-50"
          )}
        >
          <Share2 className="w-5 h-5" />
          <span>シェア</span>
        </Button>
      </div>
    </div>
  );
};