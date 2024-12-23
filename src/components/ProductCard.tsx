import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductActions } from "./product-card/ProductActions";
import { useProductLikes } from "@/hooks/useProductLikes";

interface ProductCardProps {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  comments: number;
  onClick: () => void;
}

export function ProductCard({ 
  id, 
  name, 
  tagline, 
  icon, 
  tags, 
  comments: initialComments,
  onClick 
}: ProductCardProps) {
  const [comments, setComments] = useState(initialComments);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { totalLikes, hasLiked, toggleLike } = useProductLikes(id);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // リアルタイムでコメント数を監視
    const channel = supabase
      .channel('product-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_comments',
          filter: `product_id=eq.${id}`
        },
        async () => {
          // コメント数を再取得
          const { count } = await supabase
            .from('product_comments')
            .select('id', { count: 'exact' })
            .eq('product_id', id);
          
          setComments(count || 0);
        }
      )
      .subscribe();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleLike = async () => {
    const success = await toggleLike();
    if (success) {
      toast({
        title: hasLiked ? "いいねを取り消しました" : "いいね！",
        description: hasLiked ? `${name}のいいねを取り消しました` : `${name}にいいねしました`,
      });
    } else {
      toast({
        title: "エラー",
        description: "操作に失敗しました",
        variant: "destructive",
      });
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
      
      <ProductActions
        productId={id}
        productName={name}
        likes={totalLikes}
        comments={comments}
        hasLiked={hasLiked}
        isAuthenticated={isAuthenticated}
        onLike={handleLike}
      />
    </div>
  );
}