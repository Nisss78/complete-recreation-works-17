import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layouts/AppLayout";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      console.log("Current user ID:", session.user.id);
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session) {
        console.log("Auth state changed - User ID:", session.user.id);
        setUserId(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "エラー",
          description: "プロフィールの取得に失敗しました",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        console.log("No profile found, creating new profile");
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ id: userId }])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          toast({
            title: "エラー",
            description: "プロフィールの作成に失敗しました",
            variant: "destructive",
          });
          throw createError;
        }

        return newProfile;
      }

      console.log("Profile data:", data);
      return data;
    },
    enabled: !!userId,
  });

  if (error) {
    console.error("Query error:", error);
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <ProfileHeader profile={profile} />
        <ProfileForm profile={profile} onSuccess={() => refetch()} />
      </div>
    </AppLayout>
  );
};

export default ProfilePage;