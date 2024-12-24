import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditorHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const EditorHeader = ({ title, setTitle, onSubmit, isSubmitting }: EditorHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
            placeholder={t('articles.new.titlePlaceholder')}
            className="w-[300px] border-none text-lg placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            {t('articles.new.cancel')}
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('articles.new.posting') : t('articles.new.post')}
          </Button>
        </div>
      </div>
    </div>
  );
};