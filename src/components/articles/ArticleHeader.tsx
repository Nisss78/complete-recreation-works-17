import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { FollowButton } from "./FollowButton";

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
        <Avatar className="w-10 h-10">
          <AvatarImage src={author.avatar} alt={author.name} className="object-cover" />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-500">{formatTimeAgo(postedAt)}</p>
        </div>
      </div>
      {showFollowButton && <FollowButton profileId={author.id} />}
    </div>
  );
};