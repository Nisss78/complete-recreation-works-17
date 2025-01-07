import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo } from "react";
import { ProductDetails } from "./product-dialog/ProductDetails";
import { CommentSection } from "./comments/CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MetaTags } from "./MetaTags";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    tags: string[];
    upvotes: number;
    comments: number;
    images: string[];  // オプショナルを削除
    URL?: string;
  } | null;
}

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  console.log('ProductDialog rendered with product:', product);

  if (!product) return null;

  // OGP画像のURLを生成
  const ogpImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ogp?type=product&data=${encodeURIComponent(
    JSON.stringify({
      name: product.name,
      imageUrl: product.icon
    })
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">{product.name}</DialogTitle>
      <MetaTags 
        title={product.name}
        description={product.tagline}
        image={ogpImageUrl}
        type="product"
      />
      <DialogContent className="max-w-4xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 mx-2 sm:mx-4">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-6">
            <ProductDetails 
              product={product}
              isLoadingImages={false}
            />
            <div className="mt-6 sm:mt-8">
              <CommentSection 
                productId={product.id}
                comments={[]}
                onCommentAdded={() => {}}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

ProductDialog.displayName = "ProductDialog";

export { ProductDialog };