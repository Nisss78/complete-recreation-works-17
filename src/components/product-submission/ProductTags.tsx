import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductTagsProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
}

export const ProductTags = ({ tags, setTags, newTag, setNewTag }: ProductTagsProps) => {
  const { t } = useLanguage();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product.submit.tags')}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleRemoveTag(tag)}
          >
            {tag}
            <X className="w-3 h-3 ml-1" />
          </Badge>
        ))}
      </div>
      <Input
        placeholder={t('product.submit.tagsPlaceholder')}
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
        className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
      />
    </div>
  );
};