import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductHeader } from "./product-details/ProductHeader";
import { ProductActions } from "./product-details/ProductActions";
import { useProductLikes } from "@/hooks/useProductLikes";

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
      return false;
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
    return success;
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('product.details.loginRequired'),
        description: t('product.details.loginRequiredDesc'),
        className: "text-sm p-2"
      });
      return false;
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
    return success;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProductHeader 
        name={product.name}
        tagline={product.tagline}
        description={product.description}
        icon={product.icon}
        tags={product.tags}
      />

      <ProductActions 
        productId={product.id}
        productName={product.name}
        productUrl={product.URL}
        totalLikes={totalLikes}
        hasLiked={hasLiked}
        commentCount={commentCount}
        isBookmarked={isBookmarked}
        isMobile={isMobile}
        onLike={handleLike}
        onBookmark={handleBookmark}
      />

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