import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ProductLinks } from "./product-submission/ProductLinks";
import { ProductTags } from "./product-submission/ProductTags";
import { ImageUpload } from "./product-submission/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductSubmissionDialog = ({
  open,
  onOpenChange,
}: ProductSubmissionDialogProps) => {
  const [links, setLinks] = useState<{ description: string; url: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name || !tagline || !description) {
      toast({
        title: "入力エラー",
        description: "必須項目を入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          tagline,
          description,
          icon_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop", // TODO: Replace with actual uploaded image
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert tags
      if (tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('product_tags')
          .insert(
            tags.map(tag => ({
              product_id: product.id,
              tag,
            }))
          );

        if (tagsError) throw tagsError;
      }

      // Insert links
      if (links.length > 0) {
        const { error: linksError } = await supabase
          .from('product_links')
          .insert(
            links.map(link => ({
              product_id: product.id,
              description: link.description,
              url: link.url,
            }))
          );

        if (linksError) throw linksError;
      }

      toast({
        title: "投稿完了",
        description: "プロダクトが投稿されました！",
      });

      // Reset form
      setName("");
      setTagline("");
      setDescription("");
      setTags([]);
      setLinks([]);
      onOpenChange(false);

    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: "エラー",
        description: "投稿に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-[#1A1F2C] text-white border-[#333333] p-0">
        <ScrollArea className="h-full max-h-[calc(90vh-4rem)]">
          <div className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-bold mb-1">プロダクトを投稿 🎉</h2>
              <p className="text-sm text-gray-400">
                投稿したプロダクトは何度でも編集できます！
                <br />
                とりあえず投稿してみましょう！
                <br />
                タイムライン機能を使って進捗をアピールするのもアリです！
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  プロダクト名 <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="例: TaskFlow" 
                  className="bg-[#221F26] border-[#333333] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-gray-400 mt-1">残り{50 - name.length}文字</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  タグライン <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="例: 人工知能の力で、あなたの成功物語を" 
                  className="bg-[#221F26] border-[#333333] text-white"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-400 mt-1">残り{100 - tagline.length}文字</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  説明 <span className="text-red-500">*</span>
                </label>
                <Textarea 
                  placeholder="プロダクトの概要を説明してください（50文字以上）" 
                  className="bg-[#221F26] border-[#333333] text-white min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <ProductLinks links={links} setLinks={setLinks} />
              <ProductTags tags={tags} setTags={setTags} newTag={newTag} setNewTag={setNewTag} />

              <ImageUpload 
                title="アイコン画像"
                description={[
                  "512×512ピクセル以上",
                  "2MB以下（PNG/JPG/PNG形式）"
                ]}
              />

              <ImageUpload 
                title="説明画像（最大5枚）"
                description={[
                  "クリックまたはドラッグ&ドロップで画像をアップロード",
                  "5MB以下（PNG/JPG/PNG形式）",
                  "16:9推奨"
                ]}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 p-4 border-t border-[#333333]">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-[#333333]"
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button 
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "投稿中..." : "投稿する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};