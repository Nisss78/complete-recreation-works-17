import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/articles/FollowButton";
import { Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string | null;
    bio: string | null;
    avatar_url: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    github_url?: string | null;
    other_url?: string | null;
  } | null;
  showFollowButton?: boolean;
}

export const ProfileHeader = ({ profile, showFollowButton = false }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && profile) {
        setIsOwnProfile(session.user.id === profile.id);
      }
    };
    
    checkAuth();
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.username || ""} />
            <AvatarFallback>{profile.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.username || "Anonymous"}</h1>
            {profile.bio && (
              <p className="mt-1 text-gray-500 max-w-2xl whitespace-pre-wrap">{profile.bio}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-4">
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  X (Twitter)
                </a>
              )}
              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Instagram
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  GitHub
                </a>
              )}
              {profile.other_url && (
                <a
                  href={profile.other_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              編集
            </Button>
          ) : showFollowButton ? (
            <FollowButton userId={profile.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
};