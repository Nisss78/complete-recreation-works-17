
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AvatarUploadProps {
  onUpload: (url: string) => void;
}

export const AvatarUpload = ({ onUpload }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    return interval;
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    const progressInterval = simulateProgress();
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      onUpload(publicUrl);
      
      toast({
        title: t('success.imageUploaded'),
        description: t('success.profileUpdated'),
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t('error.occurred'),
        description: t('error.upload'),
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setShowDialog(false);
      }, 500);
    }
  };

  return (
    <div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full"
            type="button"
          >
            <Upload className="mr-2 h-4 w-4" />
            {t('profile.updateAvatar')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.updateAvatar')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('profile.avatarUpload')}
              <br />
              {t('profile.avatarSize')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {isUploading ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-500">{t('profile.uploading')}</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/5 relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                accept="image/*"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('profile.avatarUpload')}
                </p>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUploading}>
              {t('common.cancel')}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
