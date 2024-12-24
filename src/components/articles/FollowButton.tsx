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
      className={className}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          {t('follow.following')}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          {t('follow.button')}
        </>
      )}
    </Button>
  );
};