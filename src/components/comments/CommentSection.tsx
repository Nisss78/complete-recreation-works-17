
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CommentItem } from "./CommentItem";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface CommentSectionProps {
  productId: number;
  comments: Comment[];
  onCommentAdded: () => void;
}

export const CommentSection = ({ productId, comments, onCommentAdded }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: userProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      console.log('Fetching profile for user:', session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Fetched profile:', data);
      return data;
    }
  });

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: t('comment.loginRequired'),
        description: t('comment.loginRequired.description'),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting comment:', {
        product_id: productId,
        user_id: session.user.id,
        content: newComment
      });

      const { error, data } = await supabase
        .from('product_comments')
        .insert({
          product_id: productId,
          user_id: session.user.id,
          content: newComment
        })
        .select();

      if (error) throw error;

      console.log('Comment posted successfully:', data);
      setNewComment("");
      onCommentAdded();
      toast({
        title: t('comment.posted'),
        description: t('comment.posted.description'),
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: t('comment.failed'),
        description: t('comment.failed.description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold mb-4">{t('comments.title')}</h3>
      
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-10 h-10">
          <AvatarImage src={userProfile?.avatar_url || undefined} className="object-cover" />
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            placeholder={isAuthenticated ? t('comments.postPlaceholder') : t('comment.loginRequired')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full"
            disabled={!isAuthenticated}
          />
        </div>
        {isAuthenticated ? (
          <Button 
            onClick={handleCommentSubmit}
            disabled={!newComment.trim() || isSubmitting}
          >
            {t('comments.postButton')}
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: t('comment.loginRequired'),
                description: t('comment.loginRequired.description')
              });
            }}
          >
            {t('comment.loginRequired')}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {t('comments.noComments')}
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              onCommentAdded={onCommentAdded}
            />
          ))
        )}
      </div>
    </div>
  );
};
