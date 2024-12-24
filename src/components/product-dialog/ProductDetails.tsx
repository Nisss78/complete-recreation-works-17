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

  const handleShare = async () => {
    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${window.location.origin}/posts/${productSlug}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "リンクをコピーしました",
        description: "クリップボードにURLをコピーしました",
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast({
        title: "コピーに失敗しました",
        description: "URLのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  console.log("Product images in ProductDetails:", product.images);

  return (
    <div className="space-y-6">
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
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <BarChart2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ProductImageCarousel 
        productName={product.name}
        images={product.images}
      />
    </div>
  );
};