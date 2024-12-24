import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/articles/FollowButton";
import { useNavigate } from "react-router-dom";

interface ArticleHeaderProps {
  article: {
    title: string;
    thumbnail_url?: string | null;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  const navigate = useNavigate();

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${article.author.id}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 mb-6">
      {article.thumbnail_url && (
        <div className="mb-4 sm:mb-6">
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {article.title}
      </h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            className="w-10 h-10 cursor-pointer" 
            onClick={handleAuthorClick}
          >
            <AvatarImage src={article.author.avatar} alt={article.author.name} className="object-cover" />
            <AvatarFallback>{article.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p 
              className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700"
              onClick={handleAuthorClick}
            >
              {article.author.name}
            </p>
          </div>
        </div>
        <FollowButton profileId={article.author.id} />
      </div>
    </div>
  );
};