import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ArticleNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageMarkdown = `![${file.name}](${publicUrl})`;
      setContent((prev) => prev + "\n" + imageMarkdown);

      toast({
        title: "画像をアップロードしました",
        description: "エディターに画像が挿入されました",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "エラー",
        description: "画像のアップロードに失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `thumbnails/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setThumbnailUrl(publicUrl);
      toast({
        title: "サムネイルを設定しました",
      });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast({
        title: "エラー",
        description: "サムネイルのアップロードに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
        <h1 className="text-2xl font-semibold">記事を書く</h1>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base">タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記事のタイトルを入力してください"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="thumbnail" className="text-base">サムネイル画像</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative">
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('thumbnail')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                画像をアップロード
              </Button>
            </div>
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt="サムネイルプレビュー" 
                className="w-20 h-20 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base">本文</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleImageUpload(file);
                  };
                  input.click();
                }}
              >
                <Image className="w-4 h-4 mr-2" />
                画像を挿入
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? "編集に戻る" : "プレビュー"}
              </Button>
            </div>
          </div>

          <div data-color-mode="light" className="border rounded-lg overflow-hidden">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview={isPreview ? "preview" : "edit"}
              height={500}
              className="border-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            キャンセル
          </Button>
          <Button>
            投稿する
          </Button>
        </div>
      </div>
    </div>
  );
}