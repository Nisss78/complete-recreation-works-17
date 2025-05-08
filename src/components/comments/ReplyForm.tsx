
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReplyFormProps {
  parentId: number;
  productId: number; // Add productId prop
  onReplyAdded: () => void;
}

export const ReplyForm = ({ parentId, productId, onReplyAdded }: ReplyFormProps) => {
  const [replyContent, setReplyContent] = useState("");
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
    },
    enabled: isAuthenticated
  });

  const handleSubmit = async () => {
    if (!replyContent.trim()) return;

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
      console.log('Submitting reply:', {
        parent_id: parentId,
        user_id: session.user.id,
        content: replyContent,
        product_id: productId
      });

      const { error } = await supabase
        .from('product_comments')
        .insert({
          parent_id: parentId,
          user_id: session.user.id,
          content: replyContent,
          product_id: productId // Include product_id in the reply
        });

      if (error) throw error;

      setReplyContent("");
      onReplyAdded();
      toast({
        title: t('comment.posted'),
        description: t('comment.posted.description'),
      });
    } catch (error) {
      console.error('Error posting reply:', error);
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
    <div className="flex items-center gap-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={userProfile?.avatar_url || undefined} />
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Input
          placeholder={isAuthenticated ? t('comments.postPlaceholder') : t('comment.loginRequired')}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="w-full"
          disabled={!isAuthenticated}
        />
      </div>
      {isAuthenticated ? (
        <Button 
          onClick={handleSubmit}
          disabled={!replyContent.trim() || isSubmitting}
        >
          {t('comments.replyButton')}
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
  );
};
