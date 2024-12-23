import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageCircle, Share2, Bookmark, BarChart2, ExternalLink } from "lucide-react";
import { memo, useState, useRef, useEffect } from "react";
import { CommentSection } from "./comments/CommentSection";
import { ProductGallery } from "./ProductGallery";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    name: string;
    description: string;
    icon: string;
    tags: string[];
    upvotes: number;
    comments: number;
  };
}

const comments = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    content: "This is exactly what I've been looking for! The UI is so intuitive.",
    timestamp: "2 hours ago",
    upvotes: 12,
    rating: 5
  },
  {
    id: 2,
    author: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop",
    content: "Great product! I especially love the integration capabilities.",
    timestamp: "4 hours ago",
    upvotes: 8,
    rating: 4
  },
  {
    id: 3,
    author: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    content: "The performance is impressive. Would love to see more features in future updates.",
    timestamp: "6 hours ago",
    upvotes: 5,
    rating: 4
  }
];

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <ScrollArea className="h-[90vh]" ref={scrollRef}>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <img src={product.icon} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </Button>
                <Button variant="outline" className="gap-2">
                  <ArrowUp className="w-4 h-4" />
                  {product.upvotes}
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {product.comments}
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <BarChart2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ProductGallery />
          </div>

          <CommentSection comments={comments} showComments={showComments} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

ProductDialog.displayName = "ProductDialog";

export { ProductDialog };