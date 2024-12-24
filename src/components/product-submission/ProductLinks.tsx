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
        <label className="block text-sm font-medium text-gray-700">プロダクトリンク</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddLink}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
              className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
              value={link.description}
              onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
            />
            <Input
              placeholder="URL（例：https://example.com）"
              className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveLink(index)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};