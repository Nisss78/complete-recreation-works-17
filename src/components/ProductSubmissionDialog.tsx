import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ProductLinks } from "./product-submission/ProductLinks";
import { ProductTags } from "./product-submission/ProductTags";
import { ImageUpload } from "./product-submission/ImageUpload";

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
                />
                <p className="text-xs text-gray-400 mt-1">残り50文字</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  タグライン <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="例: 人工知能の力で、あなたの成功物語を" 
                  className="bg-[#221F26] border-[#333333] text-white"
                />
                <p className="text-xs text-gray-400 mt-1">残り100文字</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  説明 <span className="text-red-500">*</span>
                </label>
                <Textarea 
                  placeholder="プロダクトの概要を説明してください（50文字以上）" 
                  className="bg-[#221F26] border-[#333333] text-white min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">YouTube動画</label>
                <Input 
                  placeholder="YouTubeのURL（例：https://www.youtube.com/watch?v=...）" 
                  className="bg-[#221F26] border-[#333333] text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  プロダクトのデモ動画やプレゼン動画などを追加できます
                </p>
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
          >
            キャンセル
          </Button>
          <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
            投稿する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};