import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { ProductTags } from './ProductTags';
import { ProductLinks } from './ProductLinks';

interface ProductFormData {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  link: { description: string; url: string };
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
}: {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  tagline: string;
  setTagline: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  link: { description: string; url: string };
  setLink: React.Dispatch<React.SetStateAction<{ description: string; url: string }>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setIconUrl: (url: string) => void;
  setDescriptionImages: (url: string[]) => void;
}) => {
  const { t } = useLanguage();
  const [newTag, setNewTag] = useState("");

  return (
    <div className="space-y-6 p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.name')}
        </label>
        <Input
          placeholder={t('product.submit.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.tagline')}
        </label>
        <Input
          placeholder={t('product.submit.taglinePlaceholder')}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.productDescription')}
        </label>
        <Textarea
          placeholder={t('product.submit.descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.icon')}
        </label>
        <ImageUpload
          title={t('product.submit.icon')}
          description={[
            t('product.submit.iconRequirements.0'),
            t('product.submit.iconRequirements.1'),
            t('product.submit.iconRequirements.2')
          ]}
          type="icon"
          onUpload={setIconUrl}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.images')}
        </label>
        <ImageUpload
          title={t('product.submit.images')}
          description={[
            t('product.submit.imageRequirements.0'),
            t('product.submit.imageRequirements.1'),
            t('product.submit.imageRequirements.2')
          ]}
          type="description"
          onUpload={(url) => setDescriptionImages(prev => [...prev, url])}
          maxFiles={5}
          currentFiles={0}
        />
      </div>

      <ProductTags
        tags={tags}
        setTags={setTags}
        newTag={newTag}
        setNewTag={setNewTag}
      />

      <ProductLinks
        link={link}
        setLink={setLink}
      />
    </div>
  );
};