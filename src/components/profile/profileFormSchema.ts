import * as z from "zod";

export const urlSchema = z.string().url({ message: "有効なURLを入力してください" }).optional().or(z.literal(""));

export const formSchema = z.object({
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

export type ProfileFormValues = z.infer<typeof formSchema>;

export interface ProfileData {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  other_url: string | null;
}