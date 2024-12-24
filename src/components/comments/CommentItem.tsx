import { useState } from "react";
import { useCommentLikes } from "@/hooks/useCommentLikes";
import { supabase } from "@/integrations/supabase/client";
import { ReplyForm } from "./ReplyForm";
import { ReplyList } from "./comment-replies/ReplyList";
import { useQuery } from "@tanstack/react-query";
import { CommentHeader } from "./comment-parts/CommentHeader";
import { LikeButton } from "./comment-parts/LikeButton";

interface CommentItemProps {
  comment: {
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
  };
  onCommentAdded: () => void;
  level?: number;
}

export const CommentItem = ({ comment, onCommentAdded, level = 0 }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const { totalLikes, hasLiked, toggleLike } = useCommentLikes(comment.id);

  // Fetch user profile for avatar
  const { data: userProfile } = useQuery({
    queryKey: ["profile", comment.user_id],
    queryFn: async () => {
      if (!comment.user_id) return null;
      
      console.log('Fetching profile for comment user:', comment.user_id);
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", comment.user_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Fetched comment user profile:', data);
      return data;
    },
    enabled: !!comment.user_id
  });

  const loadReplies = async () => {
    try {
      setIsLoadingReplies(true);
      const { data: repliesData, error } = await supabase
        .from('product_comments')
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedReplies = repliesData.map(reply => ({
        id: reply.id,
        author: "ユーザー",
        username: "@user",
        avatar: "https://github.com/shadcn.png",
        content: reply.content,
        timestamp: new Date(reply.created_at).toLocaleString(),
        upvotes: 0,
        isMaker: false,
        isVerified: false,
        user_id: reply.user_id
      }));

      setReplies(formattedReplies);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies && comment.reply_count && comment.reply_count > 0) {
      await loadReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplyAdded = () => {
    loadReplies();
    onCommentAdded();
  };

  return (
    <div className="space-y-2">
      <div className={`bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg ${level > 0 ? 'ml-8' : ''}`}>
        <div className="flex flex-col gap-4">
          <CommentHeader 
            username={userProfile?.username || "ユーザー"}
            avatarUrl={userProfile?.avatar_url}
            isMaker={comment.isMaker}
            isVerified={comment.isVerified}
          />
          
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          
          <div className="flex items-center gap-6 text-sm">
            <LikeButton 
              totalLikes={totalLikes}
              hasLiked={hasLiked}
              onLike={toggleLike}
            />
            <button 
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              返信
            </button>
            {comment.reply_count > 0 && (
              <button
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                onClick={handleToggleReplies}
              >
                {showReplies ? "返信を隠す" : `返信を表示 (${comment.reply_count})`}
              </button>
            )}
            <span className="text-gray-400">{comment.timestamp}</span>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-8">
          <ReplyForm 
            parentId={comment.id}
            onReplyAdded={() => {
              handleReplyAdded();
              setShowReplyForm(false);
            }}
          />
        </div>
      )}

      <ReplyList 
        replies={replies}
        isLoading={isLoadingReplies}
      />
    </div>
  );
};