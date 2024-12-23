import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductLinks } from "./ProductLinks";
import { ProductTags } from "./ProductTags";
import { ImageUpload } from "./ImageUpload";

interface ProductFormProps {
  name: string;
  setName: (name: string) => void;
  tagline: string;
  setTagline: (tagline: string) => void;
  description: string;
  setDescription: (description: string) => void;
  links: { description: string; url: string }[];
  setLinks: React.Dispatch<React.SetStateAction<{ description: string; url: string }[]>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setIconUrl: (url: string) => void;
  setDescriptionImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductForm = ({
  name,
  setName,
  tagline,
  setTagline,
  description,
  setDescription,
  links,
  setLinks,
  tags,
  setTags,
  setIconUrl,
  setDescriptionImages,
}: ProductFormProps) => {
  const [newTag, setNewTag] = useState("");
  const [descriptionImageUrls, setDescriptionImageUrls] = useState<string[]>([]);

  const handleDescriptionImageUpload = (url: string) => {
    const newUrls = [...descriptionImageUrls, url];
    setDescriptionImageUrls(newUrls);
    setDescriptionImages(newUrls);
  };

  return (
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
          type="icon"
          onUpload={setIconUrl}
        />

        <ImageUpload 
          title="説明画像（最大5枚）"
          description={[
            "クリックまたはドラッグ&ドロップで画像をアップロード",
            "5MB以下（PNG/JPG/PNG形式）",
            "16:9推奨"
          ]}
          type="description"
          onUpload={handleDescriptionImageUpload}
          maxFiles={5}
          currentFiles={descriptionImageUrls.length}
        />

        {descriptionImageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {descriptionImageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`説明画像 ${index + 1}`} 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};