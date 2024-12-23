import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle } from "lucide-react";

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
      <DialogContent className="max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <img src={product.icon} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-3">{product.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="w-full gap-1 bg-upvote hover:bg-upvote/90">
                <ArrowUp className="w-4 h-4" />
                <span>{product.upvotes}</span>
              </Button>
              
              <Button variant="outline" className="w-full gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{product.comments}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}