import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
}

export const ProductHeader = ({ 
  name, 
  tagline, 
  description, 
  icon, 
  tags 
}: ProductHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
      <img 
        src={icon} 
        alt={name} 
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{name}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-2">{tagline}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-3">{description}</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs sm:text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};