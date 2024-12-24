import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profileFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";

interface SocialLinksFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const SocialLinksFields = ({ form }: SocialLinksFieldsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Link className="w-5 h-5" />
        {t('profile.socialLinks')}
      </h3>

      <FormField
        control={form.control}
        name="twitter_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('profile.twitter')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('profile.twitterPlaceholder')} />
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
            <FormLabel>{t('profile.instagram')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('profile.instagramPlaceholder')} />
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
            <FormLabel>{t('profile.github')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('profile.githubPlaceholder')} />
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
            <FormLabel>{t('profile.website')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('profile.websitePlaceholder')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};