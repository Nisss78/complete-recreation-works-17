import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    tags: string[];
    upvotes: number;
    comments: number;
    URL?: string | null;
    "explanatory-image": string | null;
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${product.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('products')
        .update({ "explanatory-image": publicUrl })
        .eq('id', product.id);

      if (updateError) {
        throw updateError;
      }

      await queryClient.invalidateQueries({ queryKey: ['products'] });

      toast("画像がアップロードされました", {
        duration: 3000,
        className: "text-sm p-2",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("画像のアップロードに失敗しました", {
        duration: 3000,
        className: "text-sm p-2",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  const images = product["explanatory-image"] ? [product["explanatory-image"]] : [];
  console.log("Product images:", images);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={product.icon}
            alt={product.name}
            className="w-16 h-16 rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{product.tagline}</p>
          </div>
        </div>
        {product.URL && (
          <Button variant="outline" onClick={() => window.open(product.URL, '_blank')}>
            Visit Site
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

      {images.length > 0 && (
        <Carousel className="w-full max-w-lg mx-auto">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      <Button
        variant="outline"
        onClick={handleUploadButtonClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? "アップロード中..." : "画像をアップロード"}
      </Button>
    </div>
  );
}