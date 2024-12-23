import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface ProductLinksProps {
  links: { description: string; url: string }[];
  setLinks: React.Dispatch<React.SetStateAction<{ description: string; url: string }[]>>;
}

export const ProductLinks = ({ links, setLinks }: ProductLinksProps) => {
  const handleAddLink = () => {
    setLinks([...links, { description: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'description' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium">プロダクトリンク</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddLink}
          className="text-[#9b87f5] hover:text-[#7E69AB]"
        >
          <Plus className="w-4 h-4 mr-1" />
          リンクを追加
        </Button>
      </div>
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="リンクの説明（例：公式サイト、ドキュメント、YouTube動画）"
              className="bg-[#221F26] border-[#333333] text-white"
              value={link.description}
              onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
            />
            <Input
              placeholder="URL（例：https://example.com）"
              className="bg-[#221F26] border-[#333333] text-white"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveLink(index)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};