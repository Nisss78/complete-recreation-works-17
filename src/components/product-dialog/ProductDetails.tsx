import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BarChart2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useProductLikes } from "@/hooks/useProductLikes";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    "explanatory-image": string | null;
  };
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [commentCount, setCommentCount] = useState(product.comments);
  const { totalLikes, hasLiked, toggleLike } = useProductLikes(product.id);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    const channel = supabase
      .channel('product-details-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_comments',
          filter: `product_id=eq.${product.id}`
        },
        () => {
          console.log('Comment update detected in details for product:', product.id);
          fetchCommentCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "ログインが必要です",
        description: "いいねをするにはログインしてください",
        className: "text-sm p-2"
      });
      return;
    }
    const success = await toggleLike();
    if (success) {
      toast({
        title: hasLiked ? "いいねを取り消しました" : "いいね！",
        description: hasLiked ? `${product.name}のいいねを取り消しました` : `${product.name}にいいねしました`,
        className: "text-sm p-2"
      });
    }
  };

  const handleVisit = () => {
    if (product.URL) {
      window.open(product.URL, '_blank');
    }
  };

  const images = product["explanatory-image"] ? [product["explanatory-image"]] : [];
  console.log("Product images:", images);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start gap-4">
        <img 
          src={product.icon} 
          alt={product.name} 
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{product.tagline}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleVisit}
            disabled={!product.URL}
          >
            <ExternalLink className="w-4 h-4" />
            Visit
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleLike}
          >
            <ArrowUp className={`w-4 h-4 ${hasLiked ? 'text-blue-500' : ''}`} />
            {totalLikes}
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            {commentCount}
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <BarChart2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-8 mb-8">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${product.name} の説明画像 ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2">
                  <ChevronLeft className="w-4 h-4" />
                </CarouselPrevious>
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight className="w-4 h-4" />
                </CarouselNext>
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};