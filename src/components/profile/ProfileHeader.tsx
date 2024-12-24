import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Flame } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    username: string;
    avatar_url: string | null;
    bio: string | null;
    streak_count: number;
  } | null;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  if (!profile) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
        <Avatar className="w-24 h-24">
          <AvatarFallback>
            <User className="w-12 h-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">プロフィールを設定してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback>
          <User className="w-12 h-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{profile.username || "名前未設定"}</h1>
        {profile.bio && (
          <p className="text-muted-foreground max-w-md">{profile.bio}</p>
        )}
        <div className="flex items-center justify-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-muted-foreground">{profile.streak_count || 0} days streak</span>
        </div>
      </div>
    </div>
  );
};