import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profileFormSchema";

interface SocialLinksFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const SocialLinksFields = ({ form }: SocialLinksFieldsProps) => {
  return (
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
  );
};