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
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              {t('articles.new.cancel')}
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? t('articles.new.posting') : t('articles.new.post')}
            </Button>
          </div>
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('articles.new.titlePlaceholder')}
          className="w-full text-2xl font-medium border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0 px-0"
        />
      </div>
    </div>
  );
};