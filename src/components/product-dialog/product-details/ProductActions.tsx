import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BarChart2, 
  ExternalLink,
} from "lucide-react";

interface ProductActionsProps {
  productId: number;
  productName: string;
  productUrl?: string | null;
  totalLikes: number;
  hasLiked: boolean;
  commentCount: number;
  isBookmarked: boolean;
  isMobile: boolean;
  onLike: () => Promise<boolean>;
  onBookmark: () => Promise<boolean>;
}

export const ProductActions = ({
  productId,
  productName,
  productUrl,
  totalLikes,
  hasLiked,
  commentCount,
  isBookmarked,
  isMobile,
  onLike,
  onBookmark,
}: ProductActionsProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleVisit = () => {
    if (productUrl) {
      window.open(productUrl, '_blank');
    }
  };

  const handleShare = async () => {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${window.location.origin}/products/${slug}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('product.details.linkCopied'),
        description: t('product.details.linkCopiedDesc'),
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast({
        title: "エラー",
        description: "URLのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-start">
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4"
        onClick={handleVisit}
        disabled={!productUrl}
      >
        <ExternalLink className="w-4 h-4" />
        {t('product.details.visit')}
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4"
        onClick={onLike}
      >
        <ArrowUp className={`w-4 h-4 ${hasLiked ? 'text-blue-500' : ''}`} />
        {totalLikes}
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4"
      >
        <MessageCircle className="w-4 h-4" />
        {commentCount}
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onBookmark}
        className={`h-9 w-9 ${isBookmarked ? 'text-blue-500 border-blue-500' : ''}`}
      >
        <Bookmark className="w-4 h-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleShare}
        className="h-9 w-9"
      >
        <Share2 className="w-4 h-4" />
      </Button>
      {!isMobile && (
        <Button 
          variant="outline" 
          size="icon"
          className="h-9 w-9"
        >
          <BarChart2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
