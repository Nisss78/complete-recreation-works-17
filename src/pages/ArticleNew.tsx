import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EditorHeader } from "@/components/articles/article-new/EditorHeader";
import { EditorButtons } from "@/components/articles/article-new/EditorButtons";
import { ThumbnailUpload } from "@/components/articles/article-new/ThumbnailUpload";

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
      <EditorHeader
        title={title}
        setTitle={setTitle}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto relative">
          <ThumbnailUpload
            thumbnailUrl={thumbnailUrl}
            onThumbnailUpload={handleThumbnailUpload}
          />

          <div data-color-mode="light" className="rounded-lg overflow-hidden bg-white shadow-sm">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview={isPreview ? "preview" : "edit"}
              height={600}
              className="border-none"
            />
          </div>

          <EditorButtons
            isPreview={isPreview}
            setIsPreview={setIsPreview}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
}