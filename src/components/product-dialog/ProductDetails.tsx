import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BarChart2, 
  ExternalLink 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
  };
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [productLinks, setProductLinks] = useState<{ url: string }[]>([]);

  useEffect(() => {
    const fetchProductLinks = async () => {
      const { data: links } = await supabase
        .from('product_links')
        .select('url')
        .eq('product_id', product.id)
        .limit(1);
      
      if (links) {
        setProductLinks(links);
      }
    };

    fetchProductLinks();
  }, [product.id]);

  const handleVisit = () => {
    if (productLinks.length > 0) {
      window.open(productLinks[0].url, '_blank');
    }
  };

  return (
    <div className="flex items-start gap-4 mb-6">
      <img src={product.icon} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-2">{product.tagline}</p>
        <p className="text-gray-600 mb-3">{product.description}</p>
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
          disabled={productLinks.length === 0}
        >
          <ExternalLink className="w-4 h-4" />
          Visit
        </Button>
        <Button variant="outline" className="gap-2">
          <ArrowUp className="w-4 h-4" />
          {product.upvotes}
        </Button>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          {product.comments}
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
  );
};