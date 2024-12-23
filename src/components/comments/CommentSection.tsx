import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Reply, Share2, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [sortBy, setSortBy] = useState<"best" | "newest">("best");
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

      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        <span>並び替え:</span>
        <button
          className={`font-medium ${sortBy === "best" ? "text-gray-900" : ""}`}
          onClick={() => setSortBy("best")}
        >
          人気
        </button>
        <span>•</span>
        <button
          className={`font-medium ${sortBy === "newest" ? "text-gray-900" : ""}`}
          onClick={() => setSortBy("newest")}
        >
          新着
        </button>
      </div>

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="animate-fade-in bg-gray-50 p-6 rounded-lg">
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
                <p className="text-gray-700 mb-4">{comment.content}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <ArrowUp className="w-4 h-4" />
                    いいね ({comment.upvotes})
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <Reply className="w-4 h-4" />
                    返信
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <Share2 className="w-4 h-4" />
                    共有
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <Flag className="w-4 h-4" />
                    報告
                  </button>
                  <span className="text-gray-400">{comment.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};