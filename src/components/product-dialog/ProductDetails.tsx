import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BarChart2, 
  ExternalLink,
  Calendar 
} from "lucide-react";
import { format } from "date-fns";

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
    created_at?: string;
  };
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const handleVisit = () => {
    if (product.URL) {
      window.open(product.URL, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <img src={product.icon} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.tagline}</p>
          
          {product.created_at && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>投稿日: {format(new Date(product.created_at), 'yyyy年MM月dd日')}</span>
            </div>
          )}
          
          <div className="prose prose-gray max-w-none mb-4">
            <p>{product.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="gap-2 w-full"
            onClick={handleVisit}
            disabled={!product.URL}
          >
            <ExternalLink className="w-4 h-4" />
            訪問する
          </Button>
          <Button variant="outline" className="gap-2 w-full">
            <ArrowUp className="w-4 h-4" />
            {product.upvotes}
          </Button>
          <Button variant="outline" className="gap-2 w-full">
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
    </div>
  );
};