import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  onUpload: (url: string) => void;
}

export const AvatarUpload = ({ onUpload }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
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

      onUpload(publicUrl);
      
      toast({
        title: "アップロード完了",
        description: "アバター画像のアップロードが完了しました",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "エラー",
        description: "画像のアップロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div 
        className="border-2 border-dashed border-muted rounded-lg p-4 text-center bg-muted/5 relative"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          handleUpload(file);
        }}
      >
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
          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {isUploading ? "アップロード中..." : (
              <>
                クリックまたはドラッグ&ドロップで画像をアップロード
                <br />
                2MB以下（PNG/JPG形式）
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};