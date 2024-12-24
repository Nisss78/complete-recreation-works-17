import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { FollowButton } from "./FollowButton";
import { Link } from "react-router-dom";

interface ArticleHeaderProps {
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  postedAt: string;
  showFollowButton?: boolean;
}

export const ArticleHeader = ({ author, postedAt, showFollowButton = true }: ArticleHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${author.id}`}>
          <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link 
            to={`/profile/${author.id}`}
            className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
          >
            {author.name}
          </Link>
          <p className="text-sm text-gray-500">{formatTimeAgo(postedAt)}</p>
        </div>
      </div>
      {showFollowButton && <FollowButton profileId={author.id} />}
    </div>
  );
};