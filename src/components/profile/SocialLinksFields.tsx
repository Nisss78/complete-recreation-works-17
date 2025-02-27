
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
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="twitter_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block w-full text-center font-medium text-base mb-2">Twitter</FormLabel>
            <FormControl>
              <InputGroup>
                <InputLeftElement>
                  <Twitter className="h-5 w-5 text-blue-400" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.twitterPlaceholder')} className="pl-10" />
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
            <FormLabel className="block w-full text-center font-medium text-base mb-2">Instagram</FormLabel>
            <FormControl>
              <InputGroup>
                <InputLeftElement>
                  <Instagram className="h-5 w-5 text-pink-500" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.instagramPlaceholder')} className="pl-10" />
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
            <FormLabel className="block w-full text-center font-medium text-base mb-2">GitHub</FormLabel>
            <FormControl>
              <InputGroup>
                <InputLeftElement>
                  <Github className="h-5 w-5 text-gray-700" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.githubPlaceholder')} className="pl-10" />
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
            <FormLabel className="block w-full text-center font-medium text-base mb-2">ウェブサイト</FormLabel>
            <FormControl>
              <InputGroup>
                <InputLeftElement>
                  <Globe className="h-5 w-5 text-purple-500" />
                </InputLeftElement>
                <Input {...field} placeholder={t('profile.websitePlaceholder')} className="pl-10" />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
