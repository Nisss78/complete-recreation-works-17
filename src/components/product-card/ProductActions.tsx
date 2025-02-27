
import { ArrowUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  productId: number;
  productName: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  isAuthenticated: boolean;
  onLike: () => Promise<void> | void;
  isMobile: boolean;
}

export const ProductActions = ({
  likes,
  comments,
  hasLiked,
  onLike,
}: ProductActionsProps) => {
  return (
    <div className="flex gap-2 mt-auto">
      <button
        className={cn(
          "flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
          hasLiked
            ? "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onLike();
        }}
      >
        <ArrowUp className={cn("h-4 w-4", hasLiked ? "text-red-500" : "text-gray-600")} />
        <span>{likes}</span>
      </button>
      
      <button
        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
      >
        <MessageCircle className="h-4 w-4 text-gray-600" />
        <span>{comments}</span>
      </button>
    </div>
  );
};
