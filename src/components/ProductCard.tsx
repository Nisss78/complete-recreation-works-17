import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowUp, Share2, Bookmark, BarChart2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  upvotes: initialUpvotes, 
  comments, 
  onClick 
}: ProductCardProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthRequired = () => {
    toast({
      title: "ログインが必要です",
      description: "この機能を使用するにはログインしてください",
    });
    navigate("/auth");
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }

    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      toast({
        title: "いいね！",
        description: `${name}にいいねしました`,
      });
    } else {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
      toast({
        title: "いいねを取り消しました",
        description: `${name}のいいねを取り消しました`,
      });
    }
  };

  const handleInteraction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      handleAuthRequired();
    }
  };

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
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
            hasUpvoted 
              ? "text-upvote border-upvote" 
              : "text-gray-700 hover:text-upvote border-gray-200 hover:border-upvote"
          }`}
          onClick={handleUpvote}
        >
          <ArrowUp className="w-4 h-4" />
          <span className="font-medium">{upvotes}</span>
        </button>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => handleInteraction(e, 'comment')}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{comments}</span>
        </button>

        <button 
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => handleInteraction(e, 'bookmark')}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <button 
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => handleInteraction(e, 'share')}
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button 
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
          onClick={(e) => handleInteraction(e, 'stats')}
        >
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}