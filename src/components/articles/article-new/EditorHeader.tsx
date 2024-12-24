import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EditorHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const EditorHeader = ({ title, setTitle, onSubmit, isSubmitting }: EditorHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-10 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            className="w-[300px] border-none text-lg placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "投稿中..." : "投稿する"}
          </Button>
        </div>
      </div>
    </div>
  );
};