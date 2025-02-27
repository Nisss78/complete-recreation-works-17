
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
import { AvatarUpload } from "./AvatarUpload";
import { useNavigate } from "react-router-dom";
import { SocialLinksFields } from "./SocialLinksFields";
import { formSchema, ProfileFormValues } from "./profileFormSchema";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Profile } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      return data as Profile;
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
      avatar_position: profile?.avatar_position || "center",
      twitter_url: profile?.twitter_url || "",
      instagram_url: profile?.instagram_url || "",
      github_url: profile?.github_url || "",
      other_url: profile?.other_url || "",
    },
    values: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
      avatar_position: profile?.avatar_position || "center",
      twitter_url: profile?.twitter_url || "",
      instagram_url: profile?.instagram_url || "",
      github_url: profile?.github_url || "",
      other_url: profile?.other_url || "",
    }
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    if (!userId) {
      console.error("User is not authenticated");
      toast({
        title: t("error.occurred"),
        description: t("error.unauthorized"),
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
          title: t("common.warning"),
          description: t("profile.noChanges"),
        });
        navigate("/profile");
        return;
      }

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
        title: t("success.completed"),
        description: t("success.profileUpdated"),
      });

      onSuccess?.();
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("error.occurred"),
        description: t("error.occurred"),
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = (url: string) => {
    form.setValue("avatar_url", url);
  };

  const handlePositionChange = (position: string) => {
    form.setValue("avatar_position", position);
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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.avatar')}</CardTitle>
                <CardDescription>
                  {t('profile.avatarSize')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <AvatarUpload 
                          onUpload={handleAvatarUpload} 
                          onPositionChange={handlePositionChange}
                          currentUrl={field.value}
                          currentPosition={form.getValues("avatar_position")}
                          username={profile?.username || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profileSettings')}</CardTitle>
                <CardDescription>
                  {t('profile.usernamePlaceholder')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.username')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('profile.usernamePlaceholder')} />
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
                      <FormLabel>{t('profile.bio')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('profile.bioPlaceholder')}
                          className="resize-none"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Accordion type="single" collapsible defaultValue="social">
              <AccordionItem value="social">
                <AccordionTrigger>
                  {t('profile.socialLinks')}
                </AccordionTrigger>
                <AccordionContent>
                  <SocialLinksFields form={form} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('error.occurred')}</AlertTitle>
                <AlertDescription>
                  {t('error.required')}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              {t('profile.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
