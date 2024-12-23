import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Reply, Share2, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"best" | "newest">("best");
  const { toast } = useToast();

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
      toast({
        title: "コメントを投稿しました",
        description: "あなたのコメントが追加されました",
      });
    }
  };

  const handleUpvote = (commentId: number) => {
    toast({
      title: "いいね！",
      description: "コメントにいいねしました",
    });
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
          disabled={!newComment.trim()}
        >
          投稿
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
                  <button 
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                    onClick={() => handleUpvote(comment.id)}
                  >
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