
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getInitials } from "@/lib/utils";

interface AvatarUploadProps {
  currentImageUrl: string | null;
  onUpload: (url: string) => void;
  onUploadStart?: () => void;
  onUploadFinish?: () => void;
}

export const AvatarUpload = ({ 
  currentImageUrl, 
  onUpload,
  onUploadStart,
  onUploadFinish
}: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentImageUrl);
  const { toast } = useToast();
  const { t } = useLanguage();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      onUploadStart?.();

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${Math.random()}.${fileExt}`;

      // Check file size - limit to 2MB
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Check file type - only allow images
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      onUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "エラーが発生しました",
        description: "画像のアップロード中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      onUploadFinish?.();
    }
  };

  const removeAvatar = () => {
    setAvatarUrl(null);
    onUpload('');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
          {getInitials("User")}
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative focus-blue"
          disabled={uploading}
        >
          {uploading ? 'アップロード中...' : 'アバターを変更'}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          <Upload className="ml-2 h-4 w-4" />
        </Button>
        
        {avatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAvatar}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            削除
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
