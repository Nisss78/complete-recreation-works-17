import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CommentItem } from "./CommentItem";

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
  reply_count?: number;
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
            <CommentItem 
              key={comment.id} 
              comment={comment}
              onCommentAdded={onCommentAdded}
            />
          ))
        )}
      </div>
    </div>
  );
};