import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
}

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    userId: null,
  });
  const { toast } = useToast();

  const checkAdminStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          userId: null,
        });
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching admin status:", error);
        setState({
          isLoading: false,
          isAuthenticated: true,
          isAdmin: false,
          userId: session.user.id,
        });
        return;
      }

      setState({
        isLoading: false,
        isAuthenticated: true,
        isAdmin: profileData?.is_admin || false,
        userId: session.user.id,
      });
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      setState({
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        userId: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          setState({
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profileData?.is_admin || false,
            userId: session.user.id,
          });
        } else if (event === "SIGNED_OUT") {
          setState({
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
            userId: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "ログインエラー",
          description: error.message,
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error };
      }

      if (!data.user) {
        toast({
          title: "エラー",
          description: "ユーザー情報を取得できませんでした",
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: new Error("No user data") };
      }

      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profileData?.is_admin) {
        // Sign out non-admin users
        await supabase.auth.signOut();
        toast({
          title: "アクセス拒否",
          description: "管理者権限がありません",
          variant: "destructive",
        });
        setState({
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          userId: null,
        });
        return { success: false, error: new Error("Not an admin") };
      }

      setState({
        isLoading: false,
        isAuthenticated: true,
        isAdmin: true,
        userId: data.user.id,
      });

      toast({
        title: "ログイン成功",
        description: "管理者ダッシュボードへようこそ",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      userId: null,
    });
  };

  return {
    ...state,
    signIn,
    signOut,
    checkAdminStatus,
  };
};
