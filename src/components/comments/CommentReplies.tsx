
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ReplyList } from "./comment-replies/ReplyList";
import { useQuery } from "@tanstack/react-query";

interface CommentRepliesProps {
  parentId: number;
  onCommentAdded: () => void;
}

export const CommentReplies = ({ parentId, onCommentAdded }: CommentRepliesProps) => {
  const { toast } = useToast();

  const { data: replies = [], isLoading } = useQuery({
    queryKey: ['comment-replies', parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_comments')
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching comment replies:', error);
        toast({
          title: "エラー",
          description: "返信の読み込みに失敗しました",
          variant: "destructive",
        });
        return [];
      }

      // ユーザープロフィール情報を取得して返信データに追加
      const repliesWithUserInfo = await Promise.all(
        data.map(async (reply) => {
          // ユーザープロフィールを取得
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', reply.user_id)
            .maybeSingle();

          return {
            id: reply.id,
            author: userProfile?.username || "ユーザー",
            username: userProfile?.username || "@user",
            avatar: userProfile?.avatar_url || "",
            content: reply.content,
            timestamp: format(new Date(reply.created_at), 'yyyy/MM/dd HH:mm'),
            upvotes: 0,
            isMaker: false,
            isVerified: false,
            user_id: reply.user_id
          };
        })
      );

      return repliesWithUserInfo;
    }
  });

  if (isLoading) {
    return <div className="pl-8 py-2 text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="pl-8 border-l-2 border-gray-100 space-y-4">
      <ReplyList replies={replies} onCommentAdded={onCommentAdded} />
    </div>
  );
};
