import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowUp } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  upvotes: number;
  comments: number;
  onClick: () => void;
}

export function ProductCard({ id, name, description, icon, tags, upvotes, comments, onClick }: ProductCardProps) {
  return (
    <div 
      className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors rounded-lg animate-fade-in cursor-pointer" 
      onClick={onClick}
    >
      <img src={icon} alt={name} className="w-16 h-16 rounded-lg object-cover" />
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:text-upvote rounded border border-gray-200 hover:border-upvote transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle upvote
          }}
        >
          <ArrowUp className="w-4 h-4" />
          <span>{upvotes}</span>
        </button>
        
        <button 
          className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:text-gray-900 rounded border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle comment
          }}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
}