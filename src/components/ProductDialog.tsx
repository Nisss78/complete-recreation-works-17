import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useState, useRef, useEffect } from "react";
import { ProductDetails } from "./product-dialog/ProductDetails";
import { CommentSection } from "./comments/CommentSection";

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

const initialComments = [
  {
    id: 1,
    author: "田中 太郎",
    username: "@taro_tanaka",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    content: "このプロダクトは素晴らしいですね。使いやすさが特に印象的です。",
    timestamp: "2時間前",
    upvotes: 6,
    isMaker: true,
    isVerified: false
  },
  {
    id: 2,
    author: "佐藤 花子",
    username: "@hanako_sato",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop",
    content: "機能がとても充実していますね。今後の発展が楽しみです。",
    timestamp: "3時間前",
    upvotes: 7,
    isMaker: false,
    isVerified: true
  },
  {
    id: 3,
    author: "鈴木 一郎",
    username: "@ichiro_suzuki",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    content: "デザインも使いやすさも素晴らしいです。これからも期待しています！",
    timestamp: "5時間前",
    upvotes: 5,
    isMaker: false,
    isVerified: false
  }
];

// Add product images array
const productImages = [
  "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop"
];

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const scrollProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        if (scrollProgress > 30 && !showComments) {
          setShowComments(true);
        }
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [showComments]);

  const handleAddComment = (content: string) => {
    const newComment = {
      id: comments.length + 1,
      author: "ゲストユーザー",
      username: "@guest_user",
      avatar: "https://github.com/shadcn.png",
      content,
      timestamp: "たった今",
      upvotes: 0,
      isMaker: false,
      isVerified: false
    };
    setComments([newComment, ...comments]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <ScrollArea className="h-[90vh]" ref={scrollRef}>
          <div className="p-8">
            <ProductDetails product={product} />

            <div className="relative mb-8">
              <ScrollArea className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 pb-4">
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product screenshot ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-lg flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]"
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </ScrollArea>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`border-t transition-opacity duration-300 ${showComments ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-8">
              <CommentSection 
                comments={comments}
                onAddComment={handleAddComment}
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