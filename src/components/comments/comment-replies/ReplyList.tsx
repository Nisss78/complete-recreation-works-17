import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ReplyItemProps {
  reply: {
    id: number;
    author: string;
    username: string;
    avatar: string;
    content: string;
    timestamp: string;
    upvotes: number;
    isMaker: boolean;
    isVerified: boolean;
  };
}

const ReplyItem = ({ reply }: ReplyItemProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg ml-8 mt-2">
      <div className="flex gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={reply.avatar} alt={reply.author} />
          <AvatarFallback>{reply.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{reply.author}</span>
            <span className="text-gray-500 text-sm">{reply.username}</span>
            {reply.isMaker && (
              <Badge variant="secondary" className="text-xs">
                作成者
              </Badge>
            )}
            {reply.isVerified && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                認証済み
              </Badge>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
          <div className="text-xs text-gray-500 mt-2">
            {reply.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReplyListProps {
  replies: ReplyItemProps["reply"][];
  isLoading: boolean;
}

export const ReplyList = ({ replies, isLoading }: ReplyListProps) => {
  if (isLoading) {
    return (
      <div className="ml-8 text-gray-500 text-sm py-2">
        返信を読み込み中...
      </div>
    );
  }

  if (!replies.length) {
    return null;
  }

  return (
    <div className="space-y-2 mt-2">
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  );
};