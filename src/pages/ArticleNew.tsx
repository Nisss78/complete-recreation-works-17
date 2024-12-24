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

  return (
    <div className="min-h-screen bg-[#F8F9FC] relative">
      {/* Header */}
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
            <Button variant="outline" onClick={() => navigate(-1)}>
              キャンセル
            </Button>
            <Button>
              投稿する
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto relative">
          {/* Editor */}
          <div data-color-mode="light" className="rounded-lg overflow-hidden bg-white shadow-sm">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview={isPreview ? "preview" : "edit"}
              height={600}
              className="border-none"
            />
          </div>

          {/* Toolbar */}
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