import { Link } from "react-router-dom";

interface ArticleHeaderProps {
  id: number;
  title: string;
  thumbnail_url?: string | null;
}

export const ArticleHeader = ({ id, title, thumbnail_url }: ArticleHeaderProps) => {
  const defaultThumbnails = [
    'photo-1649972904349-6e44c42644a7',
    'photo-1488590528505-98d2b5aba04b',
    'photo-1518770660439-4636190af475',
    'photo-1461749280684-dccba630e2f6',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1581091226825-a6a2a5aee158',
    'photo-1485827404703-89b55fcc595e',
    'photo-1526374965328-7f61d4dc18c5',
    'photo-1531297484001-80022131f5a1',
    'photo-1487058792275-0ad4aaf24ca7'
  ];

  const randomThumbnail = defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)];
  const thumbnailUrl = thumbnail_url || `https://images.unsplash.com/${randomThumbnail}?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className="flex gap-3 sm:gap-4">
      <Link to={`/articles/${id}`} className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg shrink-0">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h2>
      </div>
    </div>
  );
};