import { Button } from "@/components/ui/button";
import { Image, Play, HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditorButtonsProps {
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
  onImageUpload: (file: File) => Promise<void>;
}

export const EditorButtons = ({ isPreview, setIsPreview, onImageUpload }: EditorButtonsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'fixed bottom-4 right-4' : 'absolute right-[-60px] top-0'} flex ${isMobile ? 'flex-row-reverse' : 'flex-col'} gap-3 z-20`}>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white shadow-md hover:bg-gray-50"
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
            if (file) onImageUpload(file);
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white shadow-md hover:bg-gray-50"
        onClick={() => window.open('https://www.markdownguide.org/basic-syntax/', '_blank')}
      >
        <HelpCircle className="w-4 h-4" />
      </Button>
    </div>
  );
};