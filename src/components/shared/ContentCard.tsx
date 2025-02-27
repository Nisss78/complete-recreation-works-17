
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getInitials } from "@/lib/utils";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface ContentCardProps {
  id: number;
  title: string;
  description?: string;
  thumbnail_url?: string | null;
  type: 'article' | 'product';
  author: Author;
  likes: number;
  comments?: number;
  postedAt: string;
  tags?: string[];
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

export function ContentCard({
  id,
  title,
  description,
  thumbnail_url,
  type,
  author,
  likes,
  comments = 0,
  postedAt,
  tags,
  showDeleteButton,
  onDelete
}: ContentCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      if (type === 'article') {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }
      
      toast({
        title: type === 'article' ? t('articles.delete') : 'Product deleted',
        description: 'Successfully deleted',
      });
      
      onDelete?.();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Error',
        description: 'Could not delete. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  const contentLink = type === 'article' ? `/article/${id}` : `/products/${id}`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <Link to={contentLink} className="block">
        <CardHeader className="p-0">
          {thumbnail_url && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={thumbnail_url}
                alt={title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link to={`/profile/${author.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{author.name}</span>
            </Link>
            <span className="text-xs text-gray-500">• {postedAt}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          
          {description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">{description}</p>
          )}
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
      
      <CardFooter className="px-4 py-2 border-t flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{likes}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </div>
        </div>
        
        {showDeleteButton && (
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowDeleteAlert(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('articles.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardFooter>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('articles.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('articles.confirmDeleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? t('common.loading') : t('articles.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
