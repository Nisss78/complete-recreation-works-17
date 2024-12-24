import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  profileId: string;
  className?: string;
}

export const FollowButton = ({ profileId, className }: FollowButtonProps) => {
  const { isFollowing, isLoading, toggleFollow } = useFollow(profileId);

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
          フォロー中
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          フォローする
        </>
      )}
    </Button>
  );
};