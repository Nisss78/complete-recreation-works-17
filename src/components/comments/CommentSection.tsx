import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Rating } from "./Rating";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  rating?: number;
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
        <h3 className="text-lg font-semibold mb-4">Discussion ({comments.length})</h3>
        
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rate this product</label>
            <Rating value={rating} onChange={setRating} />
          </div>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button 
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            className="w-full sm:w-auto"
          >
            Post Review
          </Button>
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-fade-in">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                {comment.rating && (
                  <div className="mb-2">
                    <Rating value={comment.rating} readonly />
                  </div>
                )}
                <p className="text-gray-700 mb-2">{comment.content}</p>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ArrowUp className="w-4 h-4" />
                  {comment.upvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};