import { useState, useEffect } from "react";
import { useCreateProduct, useUpdateProduct, AdminProduct, ProductLink } from "@/hooks/useAdminProducts";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Plus, ImageIcon, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LINK_TYPES = [
  { value: "website", label: "公式サイト" },
  { value: "app_store", label: "App Store" },
  { value: "play_store", label: "Play Store" },
  { value: "waitlist", label: "Waitlist" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "discord", label: "Discord" },
  { value: "other", label: "その他" },
];

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: AdminProduct | null;
}

export const ProductFormDialog = ({
  open,
  onOpenChange,
  editingProduct,
}: ProductFormDialogProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEditing = !!editingProduct;

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    icon_url: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [links, setLinks] = useState<ProductLink[]>([]);
  const [newLink, setNewLink] = useState<ProductLink>({ link_type: "website", url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState<"icon" | "image" | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        tagline: editingProduct.tagline,
        description: editingProduct.description,
        icon_url: editingProduct.icon_url,
      });
      setImages(editingProduct.product_images?.map((img) => img.image_url) || []);
      setTags(editingProduct.product_tags?.map((t) => t.tag) || []);
      setLinks(editingProduct.product_links?.map((l) => ({
        id: l.id,
        link_type: l.link_type,
        url: l.url,
        label: l.label,
        display_order: l.display_order,
      })) || []);
    } else {
      setFormData({
        name: "",
        tagline: "",
        description: "",
        icon_url: "",
      });
      setImages([]);
      setTags([]);
      setLinks([]);
    }
    setNewTag("");
    setNewLink({ link_type: "website", url: "" });
  }, [editingProduct, open]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "icon" | "image"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("ファイルサイズは2MB以下にしてください");
      return;
    }

    setIsUploading(true);
    setUploadingType(type);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const folder = type === "icon" ? "icons" : "products";
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (type === "icon") {
        setFormData((prev) => ({ ...prev, icon_url: data.publicUrl }));
      } else {
        setImages((prev) => [...prev, data.publicUrl]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
      setUploadingType(null);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const addLink = () => {
    if (newLink.url.trim()) {
      setLinks((prev) => [...prev, { ...newLink, display_order: prev.length }]);
      setNewLink({ link_type: "website", url: "" });
    }
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.tagline || !formData.description || !formData.icon_url) {
      alert("名前、タグライン、説明、アイコンは必須です");
      return;
    }

    const productData = {
      name: formData.name,
      tagline: formData.tagline,
      description: formData.description,
      icon_url: formData.icon_url,
      images,
      tags,
      links,
    };

    try {
      if (isEditing && editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "プロダクトを編集" : "プロダクトを作成"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">名前*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="プロダクト名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">タグライン*</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
              placeholder="短い説明文"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明*</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="プロダクトの詳細説明"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>アイコン画像*</Label>
            <div className="flex items-center gap-4">
              {formData.icon_url ? (
                <img
                  src={formData.icon_url}
                  alt="Icon"
                  className="h-16 w-16 object-cover rounded-lg"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "icon")}
                disabled={isUploading}
              />
              {isUploading && uploadingType === "icon" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>プロダクト画像（最大5枚）</Label>
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="h-20 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 5 && (
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    disabled={isUploading}
                  />
                  {isUploading && uploadingType === "image" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>タグ</Label>
            <div className="space-y-3">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="タグを入力"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              リンク
            </Label>
            <div className="space-y-3">
              {links.length > 0 && (
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Badge variant="outline" className="shrink-0">
                        {LINK_TYPES.find((t) => t.value === link.link_type)?.label || link.link_type}
                      </Badge>
                      <span className="text-sm truncate flex-1">{link.url}</span>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Select
                  value={newLink.link_type}
                  onValueChange={(value) =>
                    setNewLink((prev) => ({ ...prev, link_type: value }))
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="種類" />
                  </SelectTrigger>
                  <SelectContent>
                    {LINK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://example.com"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
