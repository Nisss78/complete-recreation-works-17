import { Card } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../integrations/supabase/client";
import { useToast } from "../../hooks/use-toast";
import { ArticleHeader } from "./article-card/ArticleHeader";
import { useArticleLikes } from "../../hooks/useArticleLikes";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { hasLiked, likesCount, handleLike } = useArticleLikes(id, initialLikes);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('この記事を削除してもよろしいですか？')) {
      return;
    }

    try {
      console.log('Deleting article:', id);

      // First delete all bookmarks for this article
      const { error: bookmarksError } = await supabase
        .from('article_bookmarks')
        .delete()
        .eq('article_id', id);

      if (bookmarksError) {
        console.error('Error deleting article bookmarks:', bookmarksError);
        throw bookmarksError;
      }

      // Then delete all likes for this article
      const { error: likesError } = await supabase
        .from('article_likes')
        .delete()
        .eq('article_id', id);

      if (likesError) {
        console.error('Error deleting article likes:', likesError);
        throw likesError;
      }

      // Finally delete the article itself
      const { error: articleError } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (articleError) throw articleError;

      toast({
        title: "記事を削除しました",
        description: "記事の削除が完了しました",
      });

      onDelete?.();
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast({
        title: "エラーが発生しました",
        description: "記事の削除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const handleAuthorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${author.id}`);
  };


  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await handleLike();
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
            isBookmarked={false}
            onLike={handleLikeClick}
            onBookmark={() => {}}
            onAuthorClick={handleAuthorClick}
            showDeleteButton={showDeleteButton}
            onDelete={handleDelete}
          />
        </div>
      </Card>
    </Link>
  );
};