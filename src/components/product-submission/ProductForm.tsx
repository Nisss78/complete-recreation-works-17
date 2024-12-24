import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductLinks } from "./ProductLinks";
import { ProductTags } from "./ProductTags";
import { ImageUpload } from "./ImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductFormProps {
  name: string;
  setName: (name: string) => void;
  tagline: string;
  setTagline: (tagline: string) => void;
  description: string;
  setDescription: (description: string) => void;
  link: { description: string; url: string };
  setLink: React.Dispatch<React.SetStateAction<{ description: string; url: string }>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setIconUrl: (url: string) => void;
  setDescriptionImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductForm = ({
  name,
  setName,
  tagline,
  setTagline,
  description,
  setDescription,
  link,
  setLink,
  tags,
  setTags,
  setIconUrl,
  setDescriptionImages,
}: ProductFormProps) => {
  const [newTag, setNewTag] = useState("");
  const [descriptionImageUrls, setDescriptionImageUrls] = useState<string[]>([]);
  const { t } = useLanguage();

  const handleDescriptionImageUpload = (url: string) => {
    const newUrls = [...descriptionImageUrls, url];
    setDescriptionImageUrls(newUrls);
    setDescriptionImages(newUrls);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">{t('product.submit.title')}</h2>
        <p className="text-sm text-gray-500 whitespace-pre-line">
          {t('product.submit.description')}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('product.submit.name')} <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder={t('product.submit.namePlaceholder')}
            className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
          <p className="text-xs text-gray-400 mt-1">残り {50 - name.length}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('product.submit.tagline')} <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder={t('product.submit.taglinePlaceholder')}
            className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1">残り {100 - tagline.length}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('product.submit.description')} <span className="text-red-500">*</span>
          </label>
          <Textarea 
            placeholder={t('product.submit.descriptionPlaceholder')}
            className="bg-white border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <ProductLinks link={link} setLink={setLink} />
        <ProductTags tags={tags} setTags={setTags} newTag={newTag} setNewTag={setNewTag} />

        <ImageUpload 
          title={t('product.submit.icon')}
          description={t('product.submit.iconRequirements').split('\n')}
          type="icon"
          onUpload={setIconUrl}
        />

        <ImageUpload 
          title={t('product.submit.images')}
          description={t('product.submit.imageRequirements').split('\n')}
          type="description"
          onUpload={handleDescriptionImageUpload}
          maxFiles={5}
          currentFiles={descriptionImageUrls.length}
        />

        {descriptionImageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {descriptionImageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`Description image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};