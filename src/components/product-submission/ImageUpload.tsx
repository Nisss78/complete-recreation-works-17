import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  title: string;
  description: string[];
  type: 'icon' | 'description';
  onUpload: (url: string) => void;
  maxFiles?: number;
  currentFiles?: number;
}

export const ImageUpload = ({ 
  title, 
  description, 
  type, 
  onUpload,
  maxFiles = 1,
  currentFiles = 0
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (type === 'description' && currentFiles >= maxFiles) {
      toast({
        title: "エラー",
        description: `最大${maxFiles}枚までしかアップロードできません`,
        variant: "destructive",
      });
      return;
    }

    // ファイルサイズチェック (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "エラー",
        description: "ファイルサイズは2MB以下にしてください",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting file upload:', { type, fileName: file.name, fileSize: file.size });

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      onUpload(publicUrl);
      
      toast({
        title: "アップロード完了",
        description: "画像のアップロードが完了しました",
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{title}</label>
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center relative ${
          isUploading ? 'opacity-50' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
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
          disabled={isUploading || (type === 'description' && currentFiles >= maxFiles)}
        />
        <div className="flex flex-col items-center">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {isUploading ? "アップロード中..." : (
              <>
                {description.map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
                {type === 'description' && (
                  <span className="mt-2 block">
                    {currentFiles}/{maxFiles}枚
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};