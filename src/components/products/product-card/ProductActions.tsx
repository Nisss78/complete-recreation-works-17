import { useProductBookmarks } from "@/hooks/useProductBookmarks";
import { AnimatedSquidButton } from "../AnimatedSquidButton";

interface ProductActionsProps {
  productId: number;
}

export const ProductActions = ({ productId }: ProductActionsProps) => {
  const { isBookmarked, toggleBookmark } = useProductBookmarks(productId);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleBookmark();
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatedSquidButton
        isBookmarked={isBookmarked}
        onClick={handleBookmark}
      />
    </div>
  );
};