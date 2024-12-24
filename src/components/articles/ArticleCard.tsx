import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Author {
  name: string;
  blog?: string;
  avatar: string;
}

interface ArticleCardProps {
  id: number;
  date?: string;
  title: string;
  author: Author;
  likes: number;
  postedAt: string;
}

export const ArticleCard = ({ id, date, title, author, likes: initialLikes, postedAt }: ArticleCardProps) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { toast } = useToast();

  useEffect(() => {
    checkIfLiked();
  }, []);

  const checkIfLiked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: like } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', id)
      .eq('user_id', session.user.id)
      .maybeSingle();

    setHasLiked(!!like);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the like button
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "いいねをするにはログインしてください",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasLiked) {
        // いいねを削除
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', id)
          .eq('user_id', session.user.id);

        setLikesCount(prev => Math.max(0, prev - 1));
        setHasLiked(false);

        toast({
          title: "いいねを取り消しました",
          description: "記事のいいねを取り消しました",
        });
      } else {
        // いいねを追加
        await supabase
          .from('article_likes')
          .insert({
            article_id: id,
            user_id: session.user.id
          });

        setLikesCount(prev => prev + 1);
        setHasLiked(true);

        toast({
          title: "いいね！",
          description: "記事にいいねしました",
        });
      }

      // 記事のいいね数を更新
      await supabase
        .from('articles')
        .update({ likes_count: likesCount })
        .eq('id', id);

    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "エラーが発生しました",
        description: "操作に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Link to={`/articles/${id}`}>
      <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex gap-4">
          {date ? (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-700">
              <div className="text-sm">
                {date.split("/")[0]}
              </div>
              <div className="text-xl font-bold">
                {date.split("/")[1]}
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <img 
                src={author.avatar} 
                alt="" 
                className="w-12 h-12 object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {title}
            </h2>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <img 
                  src={author.avatar}
                  alt=""
                  className="w-5 h-5 rounded-full"
                />
                <span>{author.name}</span>
                {author.blog && (
                  <>
                    <span className="text-gray-400">in</span>
                    <span>{author.blog}</span>
                  </>
                )}
              </div>
              <div className="text-gray-400">{postedAt}</div>
              <button 
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  hasLiked 
                    ? "text-pink-500 hover:text-pink-600" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
                <span>{likesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};