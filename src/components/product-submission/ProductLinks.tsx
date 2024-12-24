import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductLinksProps {
  link: { description: string; url: string };
  setLink: React.Dispatch<React.SetStateAction<{ description: string; url: string }>>;
}

export const ProductLinks = ({ link, setLink }: ProductLinksProps) => {
  const { t } = useLanguage();
  
  const handleLinkChange = (field: 'description' | 'url', value: string) => {
    setLink(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product.submit.links')}</label>
      <div className="flex gap-2">
        <Input
          placeholder={t('product.submit.linkDescription')}
          className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
          value={link.description}
          onChange={(e) => handleLinkChange('description', e.target.value)}
        />
        <Input
          placeholder={t('product.submit.linkUrl')}
          className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
          value={link.url}
          onChange={(e) => handleLinkChange('url', e.target.value)}
        />
      </div>
    </div>
  );
};