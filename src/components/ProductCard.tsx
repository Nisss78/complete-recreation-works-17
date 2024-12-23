import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowUp, Share2, Bookmark, BarChart2, X } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  upvotes: number;
  comments: number;
  onClick: () => void;
}

export function ProductCard({ 
  id, 
  name, 
  tagline, 
  icon, 
  tags, 
  upvotes, 
  comments, 
  onClick 
}: ProductCardProps) {
  return (
    <div 
      className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors rounded-lg animate-fade-in cursor-pointer relative" 
      onClick={onClick}
    >
      <img src={icon} alt={name} className="w-20 h-20 rounded-lg object-cover" />
      
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-gray-600 text-lg mt-1">{tagline}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="px-4 py-1 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-upvote rounded-full border border-gray-200 hover:border-upvote transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle upvote
          }}
        >
          <ArrowUp className="w-4 h-4" />
          <span className="font-medium">{upvotes}</span>
        </button>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle comment
          }}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{comments}</span>
        </button>

        <button 
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <button 
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button 
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}