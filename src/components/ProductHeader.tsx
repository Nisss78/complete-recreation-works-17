import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  BarChart2,
  ExternalLink 
} from "lucide-react";

interface ProductHeaderProps {
  product: {
    id: number;
    name: string;
    description: string;
    icon: string;
    tags: string[];
    upvotes: number;
    comments: number;
  };
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  return (
    <div className="flex items-start gap-4 mb-6">
      <img src={product.icon} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
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
        <Button variant="outline" className="gap-2">
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