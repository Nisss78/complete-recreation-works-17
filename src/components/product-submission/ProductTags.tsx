import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ProductTagsProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
}

export const ProductTags = ({ tags, setTags, newTag, setNewTag }: ProductTagsProps) => {
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
      <label className="block text-sm font-medium mb-1">タグ</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-[#221F26] text-white hover:bg-[#333333] cursor-pointer"
            onClick={() => handleRemoveTag(tag)}
          >
            {tag}
            <X className="w-3 h-3 ml-1" />
          </Badge>
        ))}
      </div>
      <Input
        placeholder="新しいタグを入力してEnterで追加"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
        className="bg-[#221F26] border-[#333333] text-white"
      />
    </div>
  );
};