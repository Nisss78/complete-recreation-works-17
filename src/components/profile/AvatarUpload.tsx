
import { Upload, Move } from "lucide-react";
import { useState, useRef } from "react";
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
import {
  Slider
} from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface AvatarUploadProps {
  onUpload: (url: string) => void;
  onPositionChange?: (position: string) => void;
  currentUrl?: string;
  currentPosition?: string;
  username?: string;
}

export const AvatarUpload = ({ 
  onUpload, 
  onPositionChange,
  currentUrl = "", 
  currentPosition = "center",
  username = "" 
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showPositionEditor, setShowPositionEditor] = useState(false);
  const [positionX, setPositionX] = useState(() => {
    if (currentPosition === "center") return 50;
    if (currentPosition.includes("left")) return 25;
    if (currentPosition.includes("right")) return 75;
    return 50;
  });
  const [positionY, setPositionY] = useState(() => {
    if (currentPosition === "center") return 50;
    if (currentPosition.includes("top")) return 25;
    if (currentPosition.includes("bottom")) return 75;
    return 50;
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePositionChange = () => {
    let position = "";
    
    // Vertical position
    if (positionY < 33) {
      position += "top ";
    } else if (positionY > 66) {
      position += "bottom ";
    }
    
    // Horizontal position
    if (positionX < 33) {
      position += "left";
    } else if (positionX > 66) {
      position += "right";
    }
    
    // If it's in the middle
    if (position === "") {
      position = "center";
    } else {
      position = position.trim();
    }
    
    if (onPositionChange) {
      onPositionChange(position);
    }
    
    setShowPositionEditor(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="h-24 w-24 border-2 border-primary/10">
          <AvatarImage 
            src={currentUrl} 
            alt={username} 
            objectPosition={`${positionX}% ${positionY}%`}
          />
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex justify-center gap-2">
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className="flex-1"
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
                  ref={fileInputRef}
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
        
        {currentUrl && onPositionChange && (
          <AlertDialog open={showPositionEditor} onOpenChange={setShowPositionEditor}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="flex-1"
              >
                <Move className="mr-2 h-4 w-4" />
                調整
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>画像の位置を調整</AlertDialogTitle>
                <AlertDialogDescription>
                  スライダーを動かして画像の表示位置を調整できます
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex justify-center mb-6">
                  <Avatar className="h-32 w-32 border-2 border-primary/10">
                    <AvatarImage 
                      src={currentUrl} 
                      alt={username} 
                      objectPosition={`${positionX}% ${positionY}%`}
                    />
                    <AvatarFallback>{getInitials(username)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">横方向の位置:</label>
                      <span className="text-xs">{positionX < 33 ? "左" : positionX > 66 ? "右" : "中央"}</span>
                    </div>
                    <Slider
                      value={[positionX]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setPositionX(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">縦方向の位置:</label>
                      <span className="text-xs">{positionY < 33 ? "上" : positionY > 66 ? "下" : "中央"}</span>
                    </div>
                    <Slider
                      value={[positionY]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setPositionY(value[0])}
                    />
                  </div>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t('common.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handlePositionChange}>
                  適用
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
