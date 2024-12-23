import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { X, Plus, Upload } from "lucide-react";

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

  const handleAddLink = () => {
    setLinks([...links, { description: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#1A1F2C] text-white border-[#333333]">
        <div className="space-y-6 py-4">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">プロダクトリンク</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddLink}
                  className="text-[#9b87f5] hover:text-[#7E69AB]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  リンクを追加
                </Button>
              </div>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="リンクの説明（例：公式サイト、ドキュメント、YouTube動画）"
                      className="bg-[#221F26] border-[#333333] text-white"
                    />
                    <Input
                      placeholder="URL（例：https://example.com）"
                      className="bg-[#221F26] border-[#333333] text-white"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">タグ</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#221F26] text-white hover:bg-[#333333] cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="新しいタグを入力してEnterで追加"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-[#221F26] border-[#333333] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">アイコン画像</label>
              <div className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center bg-[#221F26]">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    512×512ピクセル以上
                    <br />
                    2MB以下（PNG/JPG/PNG形式）
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">説明画像（最大5枚）</label>
              <div className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center bg-[#221F26]">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    クリックまたはドラッグ&ドロップで画像をアップロード
                    <br />
                    5MB以下（PNG/JPG/PNG形式）
                    <br />
                    16:9推奨
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-[#333333]"
            >
              キャンセル
            </Button>
            <Button
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            >
              投稿する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};