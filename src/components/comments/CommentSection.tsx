import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Flag, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { Rating } from "./Rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  rating?: number;
  username?: string;
  badge?: string;
}

interface CommentSectionProps {
  comments: Comment[];
  showComments: boolean;
}

export const CommentSection = ({ comments, showComments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment, "Rating:", rating);
      setNewComment("");
      setRating(0);
    }
  };

  return (
    <div className={`border-t transition-opacity duration-300 ${showComments ? 'opacity-100' : 'opacity-0'}`}>
      <div className="p-6">
        <div className="mb-6 flex items-start gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What do you think?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between">
              <Rating value={rating} onChange={setRating} />
              <Button 
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                variant="secondary"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Sort by:</span>
            <select className="bg-transparent border-none font-medium text-gray-900 cursor-pointer">
              <option>Best</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-fade-in">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  {comment.username && (
                    <span className="text-gray-500">@{comment.username}</span>
                  )}
                  {comment.badge && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      {comment.badge}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                {comment.rating && (
                  <div className="mb-2">
                    <Rating value={comment.rating} readonly />
                  </div>
                )}
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowUp className="w-4 h-4" />
                    <span>Upvote ({comment.upvotes})</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <Flag className="w-4 h-4" />
                    <span>Report as spam</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};