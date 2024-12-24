import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { ProductForm } from "./product-submission/ProductForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductSubmissionDialog = ({
  open,
  onOpenChange,
}: ProductSubmissionDialogProps) => {
  const [link, setLink] = useState<{ description: string; url: string }>({ description: "", url: "" });
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleSubmit = async () => {
    if (!isAdmin) {
      toast({
        title: t('error.occurred'),
        description: t('error.adminRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!name || !tagline || !description || !iconUrl) {
      toast({
        title: t('error.occurred'),
        description: t('error.required'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting product with images:', descriptionImages);
      
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          tagline,
          description,
          icon_url: iconUrl,
          URL: link.url || null,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert product images
      if (descriptionImages.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            descriptionImages.map(imageUrl => ({
              product_id: product.id,
              image_url: imageUrl,
            }))
          );

        if (imagesError) throw imagesError;
      }

      // Insert tags
      if (tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('product_tags')
          .insert(
            tags.map(tag => ({
              product_id: product.id,
              tag,
            }))
          );

        if (tagsError) throw tagsError;
      }

      toast({
        title: t('success.productPosted'),
        description: t('success.productPosted'),
      });

      // Reset form
      setName("");
      setTagline("");
      setDescription("");
      setTags([]);
      setLink({ description: "", url: "" });
      setIconUrl("");
      setDescriptionImages([]);
      onOpenChange(false);

    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: t('error.occurred'),
        description: t('error.post'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white text-gray-900 p-0">
        <ScrollArea className="h-full max-h-[calc(90vh-4rem)]">
          <ProductForm
            name={name}
            setName={setName}
            tagline={tagline}
            setTagline={setTagline}
            description={description}
            setDescription={setDescription}
            link={link}
            setLink={setLink}
            tags={tags}
            setTags={setTags}
            setIconUrl={setIconUrl}
            setDescriptionImages={setDescriptionImages}
          />
        </ScrollArea>

        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px] h-10 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            disabled={isSubmitting}
          >
            {t('product.submit.cancel')}
          </Button>
          <Button 
            variant="outline"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[100px] h-10 bg-white hover:bg-gray-50 text-gray-900 font-medium border border-gray-200"
          >
            {isSubmitting ? t('product.submit.posting') : t('product.submit.post')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};