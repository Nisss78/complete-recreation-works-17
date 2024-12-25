import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";
import { UserPlus, UserMinus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FollowButtonProps {
  profileId: string;
  className?: string;
}

export const FollowButton = ({ profileId, className }: FollowButtonProps) => {
  const { isFollowing, isLoading, toggleFollow } = useFollow(profileId);
  const { t } = useLanguage();

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFollow();
      }}
      disabled={isLoading}
      className={`h-6 px-2 text-xs font-normal ${className}`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-3 h-3 mr-1" />
          {t('follow.following')}
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3 mr-1" />
          {t('follow.button')}
        </>
      )}
    </Button>
  );
};