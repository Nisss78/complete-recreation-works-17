import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleHeader } from "./article-card/ArticleHeader";
import { useArticleBookmarks } from "@/hooks/useArticleBookmarks";

interface Author {
  id: string;
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
  showDeleteButton?: boolean;
  onDelete?: () => void;
  thumbnail_url?: string | null;
}

export const ArticleCard = ({ 
  id, 
  title, 
  author, 
  likes: initialLikes, 
  postedAt,
  showDeleteButton,
  onDelete,
  thumbnail_url
}: ArticleCardProps) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useArticleBookmarks(id);

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
    e.preventDefault();
    e.stopPropagation();
    
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
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "エラーが発生しました",
        description: "操作に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('この記事を削除してもよろしいですか？')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "記事を削除しました",
        description: "記事の削除が完了しました",
      });

      onDelete?.();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "エラーが発生しました",
        description: "記事の削除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('ArticleCard - Author click:', {
      authorId: author.id,
      authorName: author.name,
      fullAuthor: author
    });
    navigate(`/profile/${author.id}`);
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleBookmark();
  };

  return (
    <Link to={`/articles/${id}`}>
      <Card className="hover:bg-gray-50 transition-colors cursor-pointer rounded-none sm:rounded-lg">
        <div className="p-3 sm:p-4">
          <ArticleHeader
            id={id}
            title={title}
            thumbnail_url={thumbnail_url}
            author={author}
            postedAt={postedAt}
            likes={likesCount}
            hasLiked={hasLiked}
            isBookmarked={isBookmarked}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onAuthorClick={handleAuthorClick}
          />
        </div>
      </Card>
    </Link>
  );
};