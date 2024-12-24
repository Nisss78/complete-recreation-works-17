import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BarChart2, 
  ExternalLink,
} from "lucide-react";
import { useProductLikes } from "@/hooks/useProductLikes";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    tags: string[];
    upvotes: number;
    comments: number;
    URL?: string | null;
    images: string[];
  };
  isLoadingImages: boolean;
}

export const ProductDetails = ({ product, isLoadingImages }: ProductDetailsProps) => {
  const [commentCount, setCommentCount] = useState(product.comments);
  const { totalLikes, hasLiked, toggleLike } = useProductLikes(product.id);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks(product.id);
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count } = await supabase
        .from('product_comments')
        .select('id', { count: 'exact' })
        .eq('product_id', product.id);
      
      setCommentCount(count || 0);
    };

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();
    fetchCommentCount();
  }, [product.id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('product.details.loginRequired'),
        description: t('product.details.loginRequiredDesc'),
        className: "text-sm p-2"
      });
      return;
    }
    const success = await toggleLike();
    if (success) {
      toast({
        title: hasLiked ? t('product.details.like') : t('product.details.like'),
        description: hasLiked 
          ? `${product.name}のいいねを取り消しました` 
          : `${product.name}にいいねしました`,
        className: "text-sm p-2"
      });
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('product.details.loginRequired'),
        description: t('product.details.loginRequiredDesc'),
        className: "text-sm p-2"
      });
      return;
    }
    const success = await toggleBookmark();
    if (success) {
      toast({
        title: isBookmarked 
          ? t('product.details.bookmarkRemoved')
          : t('product.details.bookmarkAdded'),
        description: isBookmarked 
          ? t('product.details.bookmarkRemovedDesc').replace('{name}', product.name)
          : t('product.details.bookmarkAddedDesc').replace('{name}', product.name),
      });
    }
  };

  const handleVisit = () => {
    if (product.URL) {
      window.open(product.URL, '_blank');
    }
  };

  const handleShare = async () => {
    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${window.location.origin}/posts/${productSlug}`;
    
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <img 
          src={product.icon} 
          alt={product.name} 
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-2">{product.tagline}</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-3">{product.description}</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs sm:text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-start">
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4"
          onClick={handleVisit}
          disabled={!product.URL}
        >
          <ExternalLink className="w-4 h-4" />
          {t('product.details.visit')}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4"
          onClick={handleLike}
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
          onClick={handleBookmark}
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

      {isLoadingImages ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-[300px] sm:h-[500px] rounded-lg" />
        </div>
      ) : (
        <ProductImageCarousel 
          productName={product.name}
          images={product.images}
        />
      )}
    </div>
  );
};