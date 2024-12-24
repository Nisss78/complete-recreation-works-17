import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Reply, Share2, Flag, ThumbsUp, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCommentLikes } from "@/hooks/useCommentLikes";
import { supabase } from "@/integrations/supabase/client";
import { ReplyForm } from "./ReplyForm";
import { ReplyList } from "./comment-replies/ReplyList";
import { useQuery } from "@tanstack/react-query";

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
  const { toast } = useToast();

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
    }
  };

  const loadReplies = async () => {
    try {
      setIsLoadingReplies(true);
      console.log('Loading replies for comment:', comment.id);
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

      console.log('Fetched replies:', repliesData);

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

      console.log('Formatted replies:', formattedReplies);
      setReplies(formattedReplies);
    } catch (error) {
      console.error('Error loading replies:', error);
      toast({
        title: "エラー",
        description: "返信の読み込みに失敗しました",
        variant: "destructive",
      });
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
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userProfile?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{userProfile?.username || "ユーザー"}</span>
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
              <button 
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="w-4 h-4" />
                返信
              </button>
              {comment.reply_count > 0 && (
                <button
                  className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  onClick={handleToggleReplies}
                >
                  {showReplies ? "返信を隠す" : `返信を表示 (${comment.reply_count})`}
                </button>
              )}
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