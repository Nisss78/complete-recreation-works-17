import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CommentHeaderProps {
  username: string;
  avatarUrl?: string;
  isMaker?: boolean;
  isVerified?: boolean;
}

export const CommentHeader = ({ 
  username, 
  avatarUrl, 
  isMaker, 
  isVerified 
}: CommentHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src={avatarUrl} className="object-cover" />
        <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{username}</span>
        {isMaker && (
          <Badge variant="secondary" className="text-xs">
            作成者
          </Badge>
        )}
        {isVerified && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            認証済み
          </Badge>
        )}
      </div>
    </div>
  );
};