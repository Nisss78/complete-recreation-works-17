import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  Reply, 
  Share2, 
  Flag 
} from "lucide-react";
import { useState } from "react";

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
  showComments: boolean;
}

export const CommentSection = ({ comments, showComments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"best" | "newest">("best");

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className={`border-t transition-opacity duration-300 ${showComments ? 'opacity-100' : 'opacity-0'}`}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="What do you think?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <span>Sort by:</span>
          <button
            className={`font-medium ${sortBy === "best" ? "text-gray-900" : ""}`}
            onClick={() => setSortBy("best")}
          >
            Best
          </button>
          <span>•</span>
          <button
            className={`font-medium ${sortBy === "newest" ? "text-gray-900" : ""}`}
            onClick={() => setSortBy("newest")}
          >
            Newest
          </button>
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="animate-fade-in">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-gray-500">{comment.username}</span>
                    {comment.isMaker && (
                      <Badge variant="secondary" className="text-xs">
                        Maker
                      </Badge>
                    )}
                    {comment.isVerified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <ArrowUp className="w-4 h-4" />
                      Upvote ({comment.upvotes})
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <Flag className="w-4 h-4" />
                      Report as spam
                    </button>
                    <span className="text-gray-400">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};