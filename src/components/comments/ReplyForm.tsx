import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ReplyFormProps {
  parentId: number;
  onReplyAdded: () => void;
}

export const ReplyForm = ({ parentId, onReplyAdded }: ReplyFormProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch current user's profile
  const { data: userProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    }
  });

  const handleSubmit = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "返信を投稿するにはログインしてください",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting reply:', {
        parent_id: parentId,
        user_id: session.user.id,
        content: replyContent
      });

      const { error } = await supabase
        .from('product_comments')
        .insert({
          parent_id: parentId,
          user_id: session.user.id,
          content: replyContent,
          product_id: null // 返信の場合はproduct_idは不要
        });

      if (error) throw error;

      setReplyContent("");
      onReplyAdded();
      toast({
        title: "返信を投稿しました",
        description: "あなたの返信が追加されました",
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "エラー",
        description: "返信の投稿に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={userProfile?.avatar_url || undefined} />
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Input
          placeholder="返信を投稿..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="w-full"
        />
      </div>
      <Button 
        onClick={handleSubmit}
        disabled={!replyContent.trim() || isSubmitting}
      >
        {isSubmitting ? "投稿中..." : "返信"}
      </Button>
    </div>
  );
};