import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { FollowButton } from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ArticleHeaderProps {
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  postedAt: string;
  showFollowButton?: boolean;
}

export const ArticleHeader = ({ author, postedAt, showFollowButton = false }: ArticleHeaderProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${author.id}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar 
          className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={handleAuthorClick}
        >
          <AvatarImage src={author.avatar} alt={author.name} className="object-cover" />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p 
            className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={handleAuthorClick}
          >
            {author.name}
          </p>
          <p className="text-sm text-gray-500">{formatTimeAgo(postedAt)}</p>
        </div>
      </div>
      {showFollowButton && isAuthenticated && <FollowButton profileId={author.id} />}
    </div>
  );
};