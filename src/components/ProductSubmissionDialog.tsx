import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ProductForm } from "./product-submission/ProductForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductSubmissionDialog = ({
  open,
  onOpenChange,
}: ProductSubmissionDialogProps) => {
  const [links, setLinks] = useState<{ description: string; url: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name || !tagline || !description || !iconUrl) {
      toast({
        title: "入力エラー",
        description: "必須項目を入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting product with URL:', links[0]?.url);
      
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          tagline,
          description,
          icon_url: iconUrl,
          "Explanatory image": descriptionImages[0] || null,
          URL: links[0]?.url || null,
        })
        .select()
        .single();

      if (productError) throw productError;

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
        title: "投稿完了",
        description: "プロダクトが投稿されました！",
      });

      // Reset form
      setName("");
      setTagline("");
      setDescription("");
      setTags([]);
      setLinks([]);
      setIconUrl("");
      setDescriptionImages([]);
      onOpenChange(false);

    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: "エラー",
        description: "投稿に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-[#1A1F2C] text-white border-[#333333] p-0">
        <ScrollArea className="h-full max-h-[calc(90vh-4rem)]">
          <ProductForm
            name={name}
            setName={setName}
            tagline={tagline}
            setTagline={setTagline}
            description={description}
            setDescription={setDescription}
            links={links}
            setLinks={setLinks}
            tags={tags}
            setTags={setTags}
            setIconUrl={setIconUrl}
            setDescriptionImages={setDescriptionImages}
          />
        </ScrollArea>

        <div className="flex justify-end gap-3 p-4 border-t border-[#333333]">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-[#333333]"
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button 
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "投稿中..." : "投稿する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};