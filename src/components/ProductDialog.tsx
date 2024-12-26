import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useState, useRef, useEffect } from "react";
import { ProductDetails } from "./product-dialog/ProductDetails";
import { CommentSection } from "./comments/CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
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
  const [comments, setComments] = useState<Comment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log('ProductDialog rendered with product:', product);

  const { data: productImages = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ['product-images', product?.id],
    queryFn: async () => {
      if (!product?.id) return [];
      
      console.log('Fetching images for product:', product.id);
      const { data: imagesData, error } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching product images:', error);
        throw error;
      }
      console.log('Fetched product images:', imagesData?.map(img => img.image_url));
      return imagesData?.map(img => img.image_url) || [];
    },
    enabled: open && !!product?.id,
  });

  const fetchComments = async () => {
    if (!product?.id) return;
    
    try {
      console.log('Fetching comments for product:', product.id);
      const { data: commentsData, error } = await supabase
        .from('product_comments')
        .select(`
          id,
          content,
          created_at,
          reply_count,
          user_id,
          user:profiles!product_comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('product_id', product.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }

      console.log('Fetched comments:', commentsData);

      const formattedComments: Comment[] = (commentsData as CommentData[]).map(comment => ({
        id: comment.id,
        author: comment.user?.username || "ユーザー",
        username: comment.user?.username ? `@${comment.user.username}` : "@user",
        avatar: comment.user?.avatar_url || "https://github.com/shadcn.png",
        content: comment.content,
        timestamp: format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm'),
        upvotes: 0,
        isMaker: false,
        isVerified: false,
        reply_count: comment.reply_count,
        user_id: comment.user_id
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (open && product?.id) {
      console.log('Dialog opened, fetching comments for product:', product.id);
      fetchComments();
    }
  }, [open, product?.id]);

  if (!product) return null;

  // 最初の画像のURLを取得（存在しない場合はアイコンを使用）
  const mainImage = productImages[0] || product.icon;
  const absoluteImageUrl = mainImage.startsWith('http') 
    ? mainImage 
    : `${window.location.origin}${mainImage}`;

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
