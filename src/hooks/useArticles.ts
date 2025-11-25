import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number | null;
  profiles?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useArticles = () => {
  return useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles (id, username, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useArticleById = (id: number) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles (id, username, avatar_url)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Article> & { id: number }) => {
      const { data, error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
      toast({
        title: "成功",
        description: "記事が更新されました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      // Delete related likes and bookmarks first
      await supabase.from("article_likes").delete().eq("article_id", id);
      await supabase.from("article_bookmarks").delete().eq("article_id", id);

      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({
        title: "成功",
        description: "記事が削除されました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
