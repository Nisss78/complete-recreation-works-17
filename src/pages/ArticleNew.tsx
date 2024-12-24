import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Image, HelpCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ArticleNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

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

      // Markdownの画像構文を挿入
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記事のタイトルを入力"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="thumbnail">サムネイル画像</Label>
          <div className="mt-1 flex items-center gap-4">
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="max-w-xs"
            />
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
            <Label>本文</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
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
                variant="ghost"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Play className="w-4 h-4 mr-2" />
                {isPreview ? "編集に戻る" : "プレビュー"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a 
                  href="https://www.markdownguide.org/basic-syntax/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Markdownヘルプ
                </a>
              </Button>
            </div>
          </div>

          <div data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview={isPreview ? "preview" : "edit"}
              height={500}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">下書き保存</Button>
          <Button>公開</Button>
        </div>
      </div>
    </div>
  );
}