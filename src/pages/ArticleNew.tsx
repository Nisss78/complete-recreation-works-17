import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Image, Play, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ArticleNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      toast({
        title: "入力エラー",
        description: "タイトルと本文は必須項目です",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "エラー",
          description: "記事を投稿するにはログインが必要です",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          thumbnail_url: thumbnailUrl || null,
          user_id: session.session.user.id,
        });

      if (error) throw error;

      toast({
        title: "投稿完了",
        description: "記事が投稿されました",
      });

      navigate('/articles');
    } catch (error) {
      console.error('Error submitting article:', error);
      toast({
        title: "エラー",
        description: "記事の投稿に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleThumbnailUpload = async (file: File) => {
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
    <div className="min-h-screen bg-[#F8F9FC] relative">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
              className="w-[300px] border-none text-lg placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サムネイル画像
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailUpload(file);
                    }}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <p className="text-sm text-gray-600">
                      クリックまたはドラッグ&ドロップで画像をアップロード
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      推奨サイズ: 1200×630px
                    </p>
                  </div>
                </div>
              </div>
              {thumbnailUrl && (
                <div className="w-48">
                  <img 
                    src={thumbnailUrl} 
                    alt="サムネイルプレビュー" 
                    className="w-full aspect-[1.91/1] object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div data-color-mode="light" className="rounded-lg overflow-hidden bg-white shadow-sm">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview={isPreview ? "preview" : "edit"}
              height={600}
              className="border-none"
            />
          </div>

          <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-sm hover:bg-gray-50"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Play className="w-4 h-4" />
            </Button>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-sm hover:bg-gray-50"
              >
                <Image className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-sm hover:bg-gray-50"
              onClick={() => window.open('https://www.markdownguide.org/basic-syntax/', '_blank')}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}