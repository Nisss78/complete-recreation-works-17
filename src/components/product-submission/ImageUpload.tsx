import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  title: string;
  description: string[];
  type: 'icon' | 'description';
  onUpload: (url: string) => void;
}

export const ImageUpload = ({ title, description, type, onUpload }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    setIsUploading(true);
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('https://viaxlwsbhrzwheekrycv.functions.supabase.co/upload-image', {
        method: 'POST',
        headers: {
          // Include the Supabase anon key for authorization
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYXhsd3NiaHJ6d2hlZWtyeWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODI4OTcsImV4cCI6MjA1MDQ1ODg5N30.xBk_tmzB8qUjrr60GJTuIq1G0Wks2t1Pkzo0gEmzjIw'}`
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Upload response:', await response.text());
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      onUpload(url);
      
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
      <label className="block text-sm font-medium mb-2">{title}</label>
      <div 
        className={`border-2 border-dashed border-[#333333] rounded-lg p-8 text-center bg-[#221F26] relative ${
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
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">
            {isUploading ? "アップロード中..." : (
              description.map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
            )}
          </p>
        </div>
      </div>
    </div>
  );
};