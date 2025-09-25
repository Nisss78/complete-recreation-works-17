import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useEffect, useRef } from "react";
import { ProductDetails } from "./product-dialog/ProductDetails";
import { CommentSection } from "./comments/CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

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
    images: string[];
    URL?: string;
  } | null;
}

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  console.log('ProductDialog rendered with product:', product);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ダイアログが開かれたときにlocalStorageをチェック
    const showComments = localStorage.getItem('showCommentSection');
    if (showComments === 'true' && commentSectionRef.current) {
      setTimeout(() => {
        commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        localStorage.removeItem('showCommentSection');
      }, 300);
    }
  }, [open]);

  // コメントデータを取得し、ユーザー情報も合わせて取得する
  const { data: comments = [], refetch } = useQuery({
    queryKey: ['product-comments', product?.id],
    queryFn: async () => {
      if (!product) return [];
      
      const { data, error } = await supabase
        .from('product_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          parent_id,
          reply_count
        `)
        .eq('product_id', product.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      // ユーザープロフィール情報を取得
      const commentsWithUserInfo = await Promise.all(
        data.map(async (comment) => {
          // ユーザープロフィールを取得
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', comment.user_id)
            .maybeSingle();

          return {
            id: comment.id,
            author: userProfile?.username || "ユーザー", 
            username: userProfile?.username || "@user",
            avatar: userProfile?.avatar_url || "",
            content: comment.content,
            timestamp: format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm'),
            upvotes: 0,
            isMaker: false,
            isVerified: false,
            reply_count: comment.reply_count || 0,
            user_id: comment.user_id
          };
        })
      );

      return commentsWithUserInfo;
    },
    enabled: !!product?.id && open,
  });

  const handleCommentAdded = () => {
    refetch();
  };

  if (!product) return null;

  // OGP画像のURLを生成
  const ogpImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ogp?type=product&name=${encodeURIComponent(product.name)}&tags=${encodeURIComponent((product.tags || []).join(','))}&service=Protoduct`;
  const shareUrl = product.URL || window.location.href;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">{product.name}</DialogTitle>
      <DialogContent className="max-w-4xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 mx-2 sm:mx-4">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-6">
            {/* SNSシェアボタン */}
            <div className="flex gap-3 mb-4">
              {/* X（Twitter） */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`)}&text=${encodeURIComponent(`${product.name} | Protoduct`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
              >
                Xでシェア
              </a>
            </div>
            <ProductDetails 
              product={product}
              isLoadingImages={false}
            />
            <div className="mt-6 sm:mt-8" ref={commentSectionRef}>
              <CommentSection 
                productId={product.id}
                comments={comments}
                onCommentAdded={handleCommentAdded}
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
