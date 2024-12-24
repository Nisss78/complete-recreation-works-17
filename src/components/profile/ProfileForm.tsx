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
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  bio: z.string().max(160).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

interface ProfileFormProps {
  profile: {
    id: string;
    username: string;
    bio: string | null;
    avatar_url: string | null;
  } | null;
}

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: values.username,
        bio: values.bio,
        avatar_url: values.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "エラー",
        description: "プロフィールの更新に失敗しました",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "更新完了",
      description: "プロフィールを更新しました",
    });

    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  if (!profile) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">プロフィール設定</h2>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>アバター画像URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/avatar.jpg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
};