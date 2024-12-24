import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useState, useRef, useEffect } from "react";
import { ProductDetails } from "./product-dialog/ProductDetails";
import { CommentSection } from "./comments/CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: productImages = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ['product-images', product.id],
    queryFn: async () => {
      const { data: imagesData, error } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log('Fetched product images:', imagesData?.map(img => img.image_url));
      return imagesData?.map(img => img.image_url) || [];
    },
    enabled: open,
  });

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

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, product.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 mx-2 sm:mx-4">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogTitle className="sr-only">
          {product.name}の詳細
        </DialogTitle>
        
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-6">
            <ProductDetails 
              product={{
                ...product,
                images: productImages
              }}
              isLoadingImages={isLoadingImages}
            />
            <div className="mt-6 sm:mt-8">
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