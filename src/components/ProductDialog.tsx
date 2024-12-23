import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useState, useRef, useEffect } from "react";
import { ProductDetails } from "./product-dialog/ProductDetails";
import { CommentSection } from "./comments/CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
  };
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
}

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from('product_comments')
        .select(`
          id,
          content,
          created_at,
          reply_count
        `)
        .eq('product_id', product.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedComments = commentsData.map(comment => ({
        id: comment.id,
        author: "ユーザー",
        username: "@user",
        avatar: "https://github.com/shadcn.png",
        content: comment.content,
        timestamp: format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm'),
        upvotes: 0,
        isMaker: false,
        isVerified: false,
        reply_count: comment.reply_count
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchProductImages = async () => {
    try {
      const { data: imagesData, error } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const images = imagesData.map(img => img.image_url);
      console.log('Fetched product images:', images);
      setProductImages(images);
    } catch (error) {
      console.error('Error fetching product images:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
      fetchProductImages();
    }
  }, [open, product.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
        <DialogTitle className="sr-only">
          {product.name}の詳細
        </DialogTitle>
        
        <ScrollArea className="h-full">
          <div className="p-6">
            <ProductDetails 
              product={{
                ...product,
                images: productImages
              }}
            />
            <div className="mt-8">
              <CommentSection 
                productId={product.id}
                comments={comments}
                onCommentAdded={fetchComments}
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