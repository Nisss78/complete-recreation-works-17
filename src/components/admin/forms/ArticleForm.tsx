import { useState, useEffect } from "react";
import { useUpdateArticle, Article } from "@/hooks/useArticles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MDEditor from "@uiw/react-md-editor";

interface ArticleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingArticle: Article | null;
}

export const ArticleFormDialog = ({
  open,
  onOpenChange,
  editingArticle,
}: ArticleFormDialogProps) => {
  const updateArticle = useUpdateArticle();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editingArticle) {
      setFormData({
        title: editingArticle.title,
        content: editingArticle.content,
        thumbnail_url: editingArticle.thumbnail_url || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        thumbnail_url: "",
      });
    }
  }, [editingArticle, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("ファイルサイズは2MB以下にしてください");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, thumbnail_url: data.publicUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert("タイトルと内容は必須です");
      return;
    }

    if (!editingArticle) return;

    try {
      await updateArticle.mutateAsync({
        id: editingArticle.id,
        title: formData.title,
        content: formData.content,
        thumbnail_url: formData.thumbnail_url || null,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const isSubmitting = updateArticle.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>記事を編集</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="記事のタイトル"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>サムネイル画像</Label>
            <div className="flex items-center gap-4">
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  className="h-20 w-32 object-cover rounded-lg"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          <div className="space-y-2" data-color-mode="light">
            <Label>内容*（Markdown）</Label>
            <MDEditor
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value || "" }))
              }
              height={400}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#10c876] hover:bg-[#0eb369]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "更新する"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
