import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    username: string;
    avatar_url: string | null;
    bio: string | null;
    streak_count: number;
  } | null;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  if (!profile) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback>
          <User className="w-12 h-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        {profile.bio && (
          <p className="text-muted-foreground max-w-md">{profile.bio}</p>
        )}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>🔥 {profile.streak_count} days streak</span>
        </div>
      </div>
    </div>
  );
};