
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Twitter, Instagram, Github, Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profileFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputGroup, InputLeftElement } from "@/components/ui/input-group";

interface SocialLinksFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const SocialLinksFields = ({ form }: SocialLinksFieldsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="twitter_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('profile.twitter')}</FormLabel>
            <FormControl>
              <InputGroup>
                <InputLeftElement>
                  <Twitter className="h-4 w-4 text-blue-400" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.twitterPlaceholder')} />
              </InputGroup>
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
              <InputGroup>
                <InputLeftElement>
                  <Instagram className="h-4 w-4 text-pink-500" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.instagramPlaceholder')} />
              </InputGroup>
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
              <InputGroup>
                <InputLeftElement>
                  <Github className="h-4 w-4 text-gray-700" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.githubPlaceholder')} />
              </InputGroup>
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
              <InputGroup>
                <InputLeftElement>
                  <Globe className="h-4 w-4 text-purple-500" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.websitePlaceholder')} />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
