import { CommentItem } from "./CommentItem";

interface CommentRepliesProps {
  replies: Array<{
    id: number;
    author: string;
    username: string;
    avatar: string;
    content: string;
    timestamp: string;
    upvotes: number;
    isMaker: boolean;
    isVerified: boolean;
  }>;
  onCommentAdded: () => void;
  level: number;
}

export const CommentReplies = ({ replies, onCommentAdded, level }: CommentRepliesProps) => {
  if (!replies.length) return null;

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <CommentItem 
          key={reply.id} 
          comment={reply}
          onCommentAdded={onCommentAdded}
          level={level + 1}
        />
      ))}
    </div>
  );
};