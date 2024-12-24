import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface CommentHeaderProps {
  username: string;
  avatarUrl?: string;
  isMaker: boolean;
  isVerified: boolean;
}

export const CommentHeader = ({ username, avatarUrl, isMaker, isVerified }: CommentHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          <User className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <span className="font-semibold">{username}</span>
        {isMaker && (
          <Badge variant="secondary" className="ml-2 text-xs">
            作成者
          </Badge>
        )}
        {isVerified && (
          <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
            認証済み
          </Badge>
        )}
      </div>
    </div>
  );
};