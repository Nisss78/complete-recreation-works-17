import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Link as LinkIcon, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Link {
  url: string;
  description: string;
}

export function ProductSubmissionForm() {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [iconImage, setIconImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleAddLink = () => {
    setLinks([...links, { url: "", description: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleUpdateLink = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      tagline,
      description,
      youtubeUrl,
      links,
      tags,
      iconImage,
      images
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8 bg-[#1A1F2C] p-8 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-6">プロダクトを投稿 🎉</h1>
        <p className="text-gray-400 mb-6">
          投稿したプロダクトは何度でも編集できます！
          <br />
          とりあえず投稿してみましょう！
          <br />
          タイムライン機能を使って進捗をアピールするのもアリです！
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="name">プロダクト名 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#1E2330] border-gray-700 text-white"
              placeholder="例: TaskFlow"
            />
          </div>

          <div>
            <Label htmlFor="tagline">タグライン *</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="bg-[#1E2330] border-gray-700 text-white"
              placeholder="例: 人工知能の力で、あなたの成功物語を"
            />
          </div>

          <div>
            <Label htmlFor="description">説明 *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1E2330] border-gray-700 text-white min-h-[120px]"
              placeholder="プロダクトの概要を説明してください（50文字以上）"
            />
          </div>

          <div>
            <Label htmlFor="youtube">YouTube動画</Label>
            <Input
              id="youtube"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="bg-[#1E2330] border-gray-700 text-white"
              placeholder="YouTubeのURL（例：https://www.youtube.com/watch?v=...）"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>プロダクトリンク</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddLink}
                className="text-white border-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                リンクを追加
              </Button>
            </div>
            {links.map((link, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  value={link.description}
                  onChange={(e) => handleUpdateLink(index, "description", e.target.value)}
                  className="bg-[#1E2330] border-gray-700 text-white"
                  placeholder="リンクの説明"
                />
                <Input
                  value={link.url}
                  onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
                  className="bg-[#1E2330] border-gray-700 text-white"
                  placeholder="URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveLink(index)}
                  className="text-white border-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <Label>タグ *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[#2A2F3E] text-white cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-[#1E2330] border-gray-700 text-white"
              placeholder="新しいタグを入力してEnterで追加"
            />
          </div>

          <div>
            <Label>アイコン画像</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  クリックまたはドラッグ&ドロップで画像をアップロード
                  <br />
                  2MB以下（PNG/JPG/GIF）
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label>説明画像（最大5枚）</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  クリックまたはドラッグ&ドロップで画像をアップロード
                  <br />
                  5MB以下（PNG/JPG/GIF）
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            className="text-white border-gray-700"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
          >
            投稿する
          </Button>
        </div>
      </form>
    </div>
  );
}