import { Link } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileSocialLinksProps {
  profile: {
    twitter_url?: string;
    instagram_url?: string;
    github_url?: string;
    other_url?: string;
  };
}

export const ProfileSocialLinks = ({ profile }: ProfileSocialLinksProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-4">
      {profile.twitter_url && (
        <a
          href={profile.twitter_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
          aria-label={t("profile.twitter")}
        >
          <Link className="h-5 w-5" />
        </a>
      )}
      {profile.instagram_url && (
        <a
          href={profile.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
          aria-label={t("profile.instagram")}
        >
          <Link className="h-5 w-5" />
        </a>
      )}
      {profile.github_url && (
        <a
          href={profile.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
          aria-label={t("profile.github")}
        >
          <Link className="h-5 w-5" />
        </a>
      )}
      {profile.other_url && (
        <a
          href={profile.other_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
          aria-label={t("profile.website")}
        >
          <Link className="h-5 w-5" />
        </a>
      )}
    </div>
  );
};