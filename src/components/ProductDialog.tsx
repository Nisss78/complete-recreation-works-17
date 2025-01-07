import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    images?: string[];
  } | null;
}

interface Comment {
  id: number;
  author: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isMaker: boolean;
  isVerified: boolean;
  reply_count?: number;
  user_id?: string;
}

interface CommentData {
  id: number;
  content: string;
  created_at: string;
  reply_count: number | null;
  user_id: string;
  user: {
    username: string | null;
    avatar_url: string | null;
  };
}

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  console.log('ProductDialog rendered with product:', product);

  if (!product) return null;

  // 画像URLの絶対パスを生成
  const mainImage = product.images?.[0] || product.icon;
  const absoluteImageUrl = mainImage.startsWith('http') 
    ? mainImage 
    : `${window.location.origin}${mainImage}`;

  // Ensure images is always an array, even if empty
  const productWithImages = {
    ...product,
    images: product.images || [],
    URL: undefined // Add URL property as undefined if not present
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <MetaTags 
        title={product.name}
        description={product.tagline}
        image={absoluteImageUrl}
        type="product"
      />
      <DialogContent className="max-w-4xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 mx-2 sm:mx-4">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-6">
            <ProductDetails 
              product={productWithImages}
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