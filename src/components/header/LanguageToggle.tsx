import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ] as const;

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'ja')}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              language === lang.code && "bg-gray-100"
            )}
          >
            <span>{lang.label}</span>
            {language === lang.code && (
              <span className="text-xs text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};