import { useState, useEffect } from "react";
import { useCreateNews, useUpdateNews } from "@/hooks/useNews";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { News } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNews: News | null;
}

export const NewsFormDialog = ({
  open,
  onOpenChange,
  editingNews,
}: NewsFormDialogProps) => {
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const isEditing = !!editingNews;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    title_ja: "",
    title_en: "",
    content_ja: "",
    content_en: "",
    category: "announcement" as "announcement" | "event" | "media" | "other",
    thumbnail_url: "",
    logo_type: "new" as "old" | "new",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editingNews) {
      setFormData({
        date: editingNews.date,
        title_ja: editingNews.title_ja,
        title_en: editingNews.title_en || "",
        content_ja: editingNews.content_ja,
        content_en: editingNews.content_en || "",
        category: editingNews.category,
        thumbnail_url: editingNews.thumbnail_url || "",
        logo_type: editingNews.logo_type || "new",
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        title_ja: "",
        title_en: "",
        content_ja: "",
        content_en: "",
        category: "announcement",
        thumbnail_url: "",
        logo_type: "new",
      });
    }
  }, [editingNews, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `news-${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

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

    if (!formData.title_ja || !formData.content_ja) {
      alert("タイトル（日本語）と内容（日本語）は必須です");
      return;
    }

    const newsData = {
      date: formData.date,
      title_ja: formData.title_ja,
      title_en: formData.title_en || null,
      content_ja: formData.content_ja,
      content_en: formData.content_en || null,
      category: formData.category,
      thumbnail_url: formData.thumbnail_url || null,
      logo_type: formData.logo_type,
    };

    try {
      if (isEditing && editingNews) {
        await updateNews.mutateAsync({ id: editingNews.id, ...newsData });
      } else {
        await createNews.mutateAsync(newsData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const isSubmitting = createNews.isPending || updateNews.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "ニュースを編集" : "ニュースを作成"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">日付</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ</Label>
              <Select
                value={formData.category}
                onValueChange={(value: typeof formData.category) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">お知らせ</SelectItem>
                  <SelectItem value="event">イベント</SelectItem>
                  <SelectItem value="media">メディア</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_ja">タイトル（日本語）*</Label>
            <Input
              id="title_ja"
              value={formData.title_ja}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title_ja: e.target.value }))
              }
              placeholder="ニュースのタイトル"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_en">タイトル（英語）</Label>
            <Input
              id="title_en"
              value={formData.title_en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title_en: e.target.value }))
              }
              placeholder="News title (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content_ja">内容（日本語）*</Label>
            <Textarea
              id="content_ja"
              value={formData.content_ja}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content_ja: e.target.value }))
              }
              placeholder="ニュースの内容を入力"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content_en">内容（英語）</Label>
            <Textarea
              id="content_en"
              value={formData.content_en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content_en: e.target.value }))
              }
              placeholder="News content (optional)"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>サムネイル画像</Label>
            <div className="flex items-center gap-4">
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  className="h-20 w-20 object-cover rounded-lg"
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
              ) : isEditing ? (
                "更新する"
              ) : (
                "作成する"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
