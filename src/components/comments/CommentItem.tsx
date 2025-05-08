
import { useState, useEffect } from "react";
import { CommentHeader } from "./comment-parts/CommentHeader";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LikeButton } from "./comment-parts/LikeButton";
import { ReplyForm } from "./ReplyForm";
import { CommentReplies } from "./CommentReplies";
import { useCommentLikes } from "@/hooks/useCommentLikes";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  user_id?: string;
}

interface CommentItemProps {
  comment: Comment;
  onCommentAdded: () => void;
}

export const CommentItem = ({ comment, onCommentAdded }: CommentItemProps) => {
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { t } = useLanguage();
  const { totalLikes, hasLiked, toggleLike } = useCommentLikes(comment.id);

  // 製品IDを取得するクエリ
  const { data: productId } = useQuery({
    queryKey: ['comment-product-id', comment.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_comments')
        .select('product_id')
        .eq('id', comment.id)
        .single();
      
      if (error) {
        console.error('Error fetching product ID for comment:', error);
        return null;
      }
      
      return data.product_id;
    }
  });

  const handleReplyAdded = () => {
    setIsReplyFormVisible(false);
    onCommentAdded();
  };

  return (
    <div className="space-y-3 pb-4 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-start">
        <CommentHeader 
          username={comment.author} 
          avatarUrl={comment.avatar}
          isMaker={comment.isMaker}
          isVerified={comment.isVerified}
        />
        <span className="text-gray-500 text-xs">
          {comment.timestamp}
        </span>
      </div>
      
      <div className="text-gray-800">
        {comment.content}
      </div>
      
      <div className="flex items-center space-x-4">
        <LikeButton 
          hasLiked={hasLiked}
          totalLikes={totalLikes}
          toggleLike={toggleLike}
        />
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 px-2 text-gray-500 hover:text-gray-900"
          onClick={() => setIsReplyFormVisible(!isReplyFormVisible)}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          {t('comments.reply')}
        </Button>
        
        {comment.reply_count && comment.reply_count > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-gray-900"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                {t('comment.replies.hide')}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                {t('comment.replies.show').replace('{count}', String(comment.reply_count))}
              </>
            )}
          </Button>
        )}
      </div>
      
      {isReplyFormVisible && (
        <div className="mt-2 pl-4 border-l-2 border-gray-100">
          <ReplyForm 
            parentId={comment.id}
            productId={productId || 0} // 製品IDを渡す
            onReplyAdded={handleReplyAdded} 
          />
        </div>
      )}
      
      {showReplies && comment.reply_count && comment.reply_count > 0 && (
        <CommentReplies 
          parentId={comment.id} 
          onCommentAdded={onCommentAdded} 
        />
      )}
    </div>
  );
};
