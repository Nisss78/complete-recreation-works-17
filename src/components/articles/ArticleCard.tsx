import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Author {
  name: string;
  blog?: string;
  avatar: string;
}

interface ArticleCardProps {
  date?: string;
  title: string;
  author: Author;
  likes: number;
  postedAt: string;
}

export const ArticleCard = ({ date, title, author, likes, postedAt }: ArticleCardProps) => {
  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {date ? (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-700">
            <div className="text-sm">
              {date.split("/")[0]}
            </div>
            <div className="text-xl font-bold">
              {date.split("/")[1]}
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <img 
              src={author.avatar} 
              alt="" 
              className="w-12 h-12 object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h2>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <img 
                src={author.avatar}
                alt=""
                className="w-5 h-5 rounded-full"
              />
              <span>{author.name}</span>
              {author.blog && (
                <>
                  <span className="text-gray-400">in</span>
                  <span>{author.blog}</span>
                </>
              )}
            </div>
            <div className="text-gray-400">{postedAt}</div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};