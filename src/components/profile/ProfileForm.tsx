import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";
import { useNavigate } from "react-router-dom";
import { SocialLinksFields } from "./SocialLinksFields";
import { formSchema, ProfileFormValues, ProfileData } from "./profileFormSchema";
import { useQuery } from "@tanstack/react-query";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as ProfileData;
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
      twitter_url: profile?.twitter_url || "",
      instagram_url: profile?.instagram_url || "",
      github_url: profile?.github_url || "",
      other_url: profile?.other_url || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    if (!userId) {
      console.error("User is not authenticated");
      toast({
        title: "エラー",
        description: "ログインが必要です",
        variant: "destructive",
      });
      return;
    }

    try {
      const changedFields = Object.entries(values).reduce((acc, [key, value]) => {
        const originalValue = profile?.[key as keyof typeof profile];
        if (value !== originalValue) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "変更なし",
          description: "プロフィールに変更はありませんでした",
        });
        navigate("/profile");
        return;
      }

      console.log("Updating fields:", changedFields);

      const { error } = await supabase
        .from("profiles")
        .update({
          ...changedFields,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      toast({
        title: "更新完了",
        description: "プロフィールを更新しました",
      });

      onSuccess?.();
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "エラー",
        description: "プロフィールの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = (url: string) => {
    console.log("Avatar URL updated:", url);
    form.setValue("avatar_url", url);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 p-6 bg-card rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-semibold">プロフィール設定</h2>
          </div>
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="あなたの名前" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自己紹介</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="あなたについて教えてください（160文字まで）"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>アバター画像</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <AvatarUpload onUpload={handleAvatarUpload} />
                    {field.value && (
                      <div className="mt-2">
                        <img 
                          src={field.value} 
                          alt="アバタープレビュー" 
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                    )}
                    <Input {...field} type="hidden" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SocialLinksFields form={form} />

          <Button type="submit" className="w-full">
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
};