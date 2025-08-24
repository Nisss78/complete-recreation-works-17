import { useState, useRef } from "react";
import { useCreateNews } from "@/hooks/useNews";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NewsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsForm({ open, onOpenChange }: NewsFormProps) {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const createNews = useCreateNews();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [date, setDate] = useState<Date>(new Date());
  const [titleJa, setTitleJa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentJa, setContentJa] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [category, setCategory] = useState<"announcement" | "event" | "media" | "other">("announcement");
  const [logoType, setLogoType] = useState<"old" | "new">("new");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: isJapanese ? "エラー" : "Error",
        description: isJapanese 
          ? "ファイルサイズは5MB以下にしてください" 
          : "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `news-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setThumbnailUrl(publicUrl);
      setPreviewUrl(publicUrl);
      
      toast({
        title: isJapanese ? "成功" : "Success",
        description: isJapanese 
          ? "画像がアップロードされました" 
          : "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: isJapanese ? "エラー" : "Error",
        description: isJapanese 
          ? "画像のアップロードに失敗しました" 
          : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeThumbnail = () => {
    setThumbnailUrl("");
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createNews.mutateAsync({
      date: format(date, 'yyyy-MM-dd'),
      title_ja: titleJa,
      title_en: titleEn || undefined,
      content_ja: contentJa,
      content_en: contentEn || undefined,
      thumbnail_url: thumbnailUrl || undefined,
      category,
      logo_type: logoType,
    });

    // Reset form
    setTitleJa("");
    setTitleEn("");
    setContentJa("");
    setContentEn("");
    setCategory("announcement");
    setLogoType("new");
    setDate(new Date());
    setThumbnailUrl("");
    setPreviewUrl("");
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isJapanese ? "ニュース追加" : "Add News"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label>{isJapanese ? "日付" : "Date"} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{isJapanese ? "カテゴリー" : "Category"} *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">
                  {isJapanese ? "お知らせ" : "Announcement"}
                </SelectItem>
                <SelectItem value="event">
                  {isJapanese ? "イベント" : "Event"}
                </SelectItem>
                <SelectItem value="media">
                  {isJapanese ? "メディア" : "Media"}
                </SelectItem>
                <SelectItem value="other">
                  {isJapanese ? "その他" : "Other"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label>{isJapanese ? "サムネイル画像" : "Thumbnail Image"}</Label>
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Thumbnail preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeThumbnail}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading 
                    ? (isJapanese ? "アップロード中..." : "Uploading...") 
                    : (isJapanese ? "画像を選択" : "Choose Image")}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {isJapanese 
                    ? "JPG, PNG, GIF形式 (最大5MB)" 
                    : "JPG, PNG, GIF format (max 5MB)"}
                </p>
              </div>
            )}
          </div>

          {/* Logo Type (for rebranding news) */}
          <div className="space-y-2">
            <Label>{isJapanese ? "ロゴタイプ" : "Logo Type"}</Label>
            <RadioGroup value={logoType} onValueChange={(v) => setLogoType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">{isJapanese ? "新ロゴ" : "New Logo"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="old" id="old" />
                <Label htmlFor="old">{isJapanese ? "旧ロゴ" : "Old Logo"}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Japanese Title */}
          <div className="space-y-2">
            <Label>タイトル (日本語) *</Label>
            <Input
              value={titleJa}
              onChange={(e) => setTitleJa(e.target.value)}
              required
              placeholder="例: Athena Technologies コーポレートロゴ刷新のお知らせ"
            />
          </div>

          {/* English Title (Optional) */}
          <div className="space-y-2">
            <Label>Title (English) - Optional</Label>
            <Input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g., Athena Technologies Corporate Logo Renewal Announcement"
            />
          </div>

          {/* Japanese Content */}
          <div className="space-y-2">
            <Label>内容 (日本語) *</Label>
            <Textarea
              value={contentJa}
              onChange={(e) => setContentJa(e.target.value)}
              required
              rows={8}
              placeholder="記事の内容を入力してください..."
            />
          </div>

          {/* English Content (Optional) */}
          <div className="space-y-2">
            <Label>Content (English) - Optional</Label>
            <Textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={8}
              placeholder="Enter article content..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isJapanese ? "キャンセル" : "Cancel"}
            </Button>
            <Button 
              type="submit" 
              className="bg-[#0066FF] hover:bg-[#0052CC]"
              disabled={createNews.isPending}
            >
              {createNews.isPending 
                ? (isJapanese ? "追加中..." : "Adding...") 
                : (isJapanese ? "追加" : "Add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}