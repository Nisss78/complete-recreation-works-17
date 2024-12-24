import { Input } from "@/components/ui/input";

interface ProductLinksProps {
  link: { description: string; url: string };
  setLink: React.Dispatch<React.SetStateAction<{ description: string; url: string }>>;
}

export const ProductLinks = ({ link, setLink }: ProductLinksProps) => {
  const handleLinkChange = (field: 'description' | 'url', value: string) => {
    setLink(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">プロダクトリンク</label>
      <div className="flex gap-2">
        <Input
          placeholder="リンクの説明（例：公式サイト）"
          className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
          value={link.description}
          onChange={(e) => handleLinkChange('description', e.target.value)}
        />
        <Input
          placeholder="URL（例：https://example.com）"
          className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
          value={link.url}
          onChange={(e) => handleLinkChange('url', e.target.value)}
        />
      </div>
    </div>
  );
};