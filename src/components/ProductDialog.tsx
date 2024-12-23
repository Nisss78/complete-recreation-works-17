import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageCircle, Share2, Bookmark, BarChart2, ExternalLink } from "lucide-react";
import { memo, useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

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

const images = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
];

const comments = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    content: "This is exactly what I've been looking for! The UI is so intuitive.",
    timestamp: "2 hours ago",
    upvotes: 12
  },
  {
    id: 2,
    author: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop",
    content: "Great product! I especially love the integration capabilities.",
    timestamp: "4 hours ago",
    upvotes: 8
  },
  {
    id: 3,
    author: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    content: "The performance is impressive. Would love to see more features in future updates.",
    timestamp: "6 hours ago",
    upvotes: 5
  }
];

const ProductDialog = memo(({ open, onOpenChange, product }: ProductDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

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

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

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
              <h3 className="text-lg font-semibold mb-4">Discussion ({comments.length})</h3>
              
              <div className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                  className="w-full sm:w-auto"
                >
                  Post Comment
                </Button>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 animate-fade-in">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowUp className="w-4 h-4" />
                        {comment.upvotes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

ProductDialog.displayName = "ProductDialog";

export { ProductDialog };