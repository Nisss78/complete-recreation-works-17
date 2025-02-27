
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; 
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SocialLinksFields } from "./SocialLinksFields";

export const ProfileForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [otherUrl, setOtherUrl] = useState("");

  // Get the current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    getCurrentUser();
  }, []);

  // If we're on a profile page (not settings), fetch the profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url);
        setTwitterUrl(data.twitter_url || "");
        setInstagramUrl(data.instagram_url || "");
        setGithubUrl(data.github_url || "");
        setOtherUrl(data.other_url || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: t("error.fetchProfile"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, toast, t]);

  const handleSave = async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          bio,
          avatar_url: avatarUrl,
          twitter_url: twitterUrl || null,
          instagram_url: instagramUrl || null,
          github_url: githubUrl || null,
          other_url: otherUrl || null,
          updated_at: new Date(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: t("success.profileUpdated"),
      });

      // Redirect to profile page after saving from settings
      if (!profileId) {
        navigate(`/profile`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("error.occurred"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("profile.edit")}</h2>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">{t("profile.username")}</Label>
            <Input
              id="username"
              placeholder={t("profile.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">{t("profile.bio")}</Label>
            <Textarea
              id="bio"
              placeholder={t("profile.bioPlaceholder")}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="avatar">{t("profile.avatar")}</Label>
            <AvatarUpload
              onUploadComplete={handleAvatarUpload}
              currentAvatarUrl={avatarUrl}
              onUploadStart={() => setIsUploading(true)}
              onUploadEnd={() => setIsUploading(false)}
            />
          </div>

          {/* Social links section */}
          <SocialLinksFields
            twitterUrl={twitterUrl}
            instagramUrl={instagramUrl}
            githubUrl={githubUrl}
            otherUrl={otherUrl}
            setTwitterUrl={setTwitterUrl}
            setInstagramUrl={setInstagramUrl}
            setGithubUrl={setGithubUrl}
            setOtherUrl={setOtherUrl}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("profile.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
