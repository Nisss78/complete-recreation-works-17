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
  links: { description: string; url: string }[];
}

export const ProductForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (!iconFile) {
        throw new Error('Product icon is required');
      }

      // Upload icon
      const iconFormData = new FormData();
      iconFormData.append('file', iconFile);

      // Upload product images
      const imagePromises = productImages.map(async (file) => {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        // Implement image upload logic here
        return 'image_url_placeholder';
      });

      const uploadedImageUrls = await Promise.all(imagePromises);

      // Create product with uploaded media
      const productData = {
        ...data,
        icon_url: 'icon_url_placeholder',
        image_urls: uploadedImageUrls,
        tags: tags,
      };

      // Implement product creation logic here

      toast({
        title: t('success.completed'),
        description: t('success.productPosted')
      });
      reset();
      setIconFile(null);
      setProductImages([]);
      setTags([]);
    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: t('error.occurred'),
        description: t('error.post'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIconUpload = (file: File) => {
    setIconFile(file);
  };

  const handleImagesUpload = (files: File[]) => {
    setProductImages(files);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.name')}
        </label>
        <Input
          {...register('name', { required: true })}
          placeholder={t('product.submit.namePlaceholder')}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">This field is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.tagline')}
        </label>
        <Input
          {...register('tagline', { required: true })}
          placeholder={t('product.submit.taglinePlaceholder')}
          className="mt-1"
        />
        {errors.tagline && (
          <p className="mt-1 text-sm text-red-600">This field is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.productDescription')}
        </label>
        <Textarea
          {...register('description', { required: true })}
          placeholder={t('product.submit.descriptionPlaceholder')}
          className="mt-1"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">This field is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.icon')}
        </label>
        <ImageUpload
          onUpload={handleIconUpload}
          maxFiles={1}
          accept="image/*"
          maxSize={2 * 1024 * 1024}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('product.submit.images')}
        </label>
        <ImageUpload
          onUpload={handleImagesUpload}
          maxFiles={5}
          accept="image/*"
          maxSize={2 * 1024 * 1024}
          multiple
        />
      </div>

      <ProductTags onTagsChange={handleTagsChange} />

      <ProductLinks register={register} />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          {t('product.submit.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('product.submit.posting') : t('product.submit.post')}
        </Button>
      </div>
    </form>
  );
};