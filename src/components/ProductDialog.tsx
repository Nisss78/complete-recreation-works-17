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

const images = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
];

const initialComments = [
  {
    id: 1,
    author: "Fardin Shek",
    username: "@mocdtceo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    content: "WebSparks makes building apps so effortless—it's like having a personal developer on call 24/7. Can't wait to see what everyone creates with this!",
    timestamp: "Dec 21",
    upvotes: 6,
    isMaker: true,
    isVerified: false
  },
  {
    id: 2,
    author: "André J",
    username: "@sentry_co",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop",
    content: "☕ Proof is in the pudding as they say 😼. If I may ask, whats the top 3 products that has been made with this platform?",
    timestamp: "Dec 22",
    upvotes: 7,
    isMaker: false,
    isVerified: true
  },
  {
    id: 3,
    author: "MD ALLMAMUN Ridoy",
    username: "@md_allmamun_ridoy",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    content: "WebSparks is an AI Software Engineer that seamlessly manages your entire software development lifecycle, just like a human engineer. It simplifies application development.",
    timestamp: "Dec 22",
    upvotes: 5,
    isMaker: true,
    isVerified: false
  }
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
      author: "Current User",
      username: "@current_user",
      avatar: "https://github.com/shadcn.png",
      content,
      timestamp: "Just now",
      upvotes: 0,
      isMaker: false,
      isVerified: false
    };
    setComments([newComment, ...comments]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <ScrollArea className="h-[90vh]" ref={scrollRef}>
          <div className="p-6">
            <ProductDetails product={product} />

            <div className="relative mb-6">
              <ScrollArea className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4">
                  {images.map((image, index) => (
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
                {images.map((_, index) => (
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
            <div className="p-6">
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