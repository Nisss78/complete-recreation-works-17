import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, Share2, Flag, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCommentLikes } from "@/hooks/useCommentLikes";

interface Comment {
  id: number;
  author: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isMaker: boolean;
  isVerified: boolean;
}

interface CommentSectionProps {
  productId: number;
  comments: Comment[];
  onCommentAdded: () => void;
}

export const CommentSection = ({ productId, comments, onCommentAdded }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "コメントを投稿するにはログインしてください",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('product_comments')
        .insert({
          product_id: productId,
          user_id: session.user.id,
          content: newComment
        });

      if (error) throw error;

      setNewComment("");
      onCommentAdded();
      toast({
        title: "コメントを投稿しました",
        description: "あなたのコメントが追加されました",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "エラー",
        description: "コメントの投稿に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const { totalLikes, hasLiked, toggleLike } = useCommentLikes(comment.id);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
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

      const success = await toggleLike();
      if (success) {
        toast({
          title: hasLiked ? "いいねを取り消しました" : "いいね！",
          description: hasLiked ? "コメントのいいねを取り消しました" : "コメントにいいねしました",
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
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.avatar} alt={comment.author} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-gray-500">{comment.username}</span>
              {comment.isMaker && (
                <Badge variant="secondary" className="text-xs">
                  作成者
                </Badge>
              )}
              {comment.isVerified && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  認証済み
                </Badge>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.content}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <button 
                className={`flex items-center gap-1 transition-colors ${
                  hasLiked 
                    ? 'text-blue-500 hover:text-blue-600' 
                    : 'hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4" />
                いいね ({totalLikes})
              </button>
              <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Reply className="w-4 h-4" />
                返信
              </button>
              <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Share2 className="w-4 h-4" />
                共有
              </button>
              <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Flag className="w-4 h-4" />
                報告
              </button>
              <span className="text-gray-400">{comment.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold mb-4">コメント</h3>
      
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            placeholder="コメントを投稿..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleCommentSubmit}
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? "投稿中..." : "投稿"}
        </Button>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            まだコメントはありません。最初のコメントを投稿してみましょう！
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};