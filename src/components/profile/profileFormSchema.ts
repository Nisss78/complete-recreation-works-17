
import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  avatar_position: z.string().optional(),
  twitter_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  other_url: z.string().url().optional().or(z.literal(""))
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export interface ProfileData {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  avatar_position: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  other_url: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}
