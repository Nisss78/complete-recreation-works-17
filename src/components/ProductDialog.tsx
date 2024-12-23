import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle, Share2, ChartBar, BookmarkPlus } from "lucide-react";

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

export function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-4">
              <img src={product.icon} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                    <p className="text-gray-600 text-lg mb-3">{product.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-gray-200">
                      Visit
                    </Button>
                    <Button className="bg-upvote hover:bg-upvote/90 gap-1">
                      <ArrowUp className="w-4 h-4" />
                      <span>{product.upvotes}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <button className="flex items-center gap-1 hover:text-gray-900">
                    <MessageCircle className="w-4 h-4" />
                    <span>Discuss</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900">
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Collect</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900">
                    <ChartBar className="w-4 h-4" />
                    <span>Stats</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div className="relative w-full bg-black">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <div className="flex-shrink-0 w-full snap-center">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=600&fit=crop" 
                  alt="Product screenshot" 
                  className="w-full h-[500px] object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-full snap-center">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop" 
                  alt="Product screenshot" 
                  className="w-full h-[500px] object-contain"
                />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white opacity-100" />
              <div className="w-2 h-2 rounded-full bg-white opacity-50" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}