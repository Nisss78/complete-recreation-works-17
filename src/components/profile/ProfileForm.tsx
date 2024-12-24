import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { User, Link } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

const urlSchema = z.string().url({ message: "有効なURLを入力してください" }).optional().or(z.literal(""));

const formSchema = z.object({
  username: z.string().min(2, {
    message: "ユーザー名は2文字以上で入力してください",
  }).max(50, {
    message: "ユーザー名は50文字以下で入力してください",
  }),
  bio: z.string().max(160, {
    message: "自己紹介は160文字以下で入力してください",
  }).optional(),
  avatar_url: z.string().url({
    message: "有効なURLを入力してください",
  }).optional().or(z.literal("")),
  twitter_url: urlSchema,
  instagram_url: urlSchema,
  github_url: urlSchema,
  other_url: urlSchema,
});

interface ProfileFormProps {
  profile: {
    id: string;
    username: string;
    bio: string | null;
    avatar_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
    github_url: string | null;
    other_url: string | null;
  } | null;
  onSuccess?: () => void;
}

export const ProfileForm = ({ profile, onSuccess }: ProfileFormProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: values.username,
          bio: values.bio,
          avatar_url: values.avatar_url,
          twitter_url: values.twitter_url,
          instagram_url: values.instagram_url,
          github_url: values.github_url,
          other_url: values.other_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "エラー",
          description: `プロフィールの更新に失敗しました: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log("Profile updated successfully:", data);
      toast({
        title: "更新完了",
        description: "プロフィールを更新しました",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "エラー",
        description: "予期せぬエラーが発生しました",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = (url: string) => {
    console.log("Avatar URL updated:", url);
    form.setValue("avatar_url", url);
  };

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

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Link className="w-5 h-5" />
              ソーシャルリンク
            </h3>

            <FormField
              control={form.control}
              name="twitter_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (Twitter)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://twitter.com/yourusername" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://instagram.com/yourusername" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://github.com/yourusername" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="other_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>その他のリンク</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://yourwebsite.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
};