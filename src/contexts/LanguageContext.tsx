
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "@/translations/en";
import { ja } from "@/translations/ja";
import { supabase } from "@/integrations/supabase/client";

type Language = "en" | "ja";
type Translations = typeof en | typeof ja;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof en | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>(en);

  useEffect(() => {
    // Try to get language preference from localStorage first
    const savedLanguage = localStorage.getItem("language") as Language | null;
    
    // If there's a saved preference, use it
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ja")) {
      setLanguageState(savedLanguage);
      setTranslations(savedLanguage === "ja" ? ja : en);
    } else {
      // If no saved preference, check if user is logged in
      const checkUserPreference = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('language_preference')
            .eq('id', session.user.id)
            .single();
          
          if (profile?.language_preference && 
              (profile.language_preference === "en" || profile.language_preference === "ja")) {
            setLanguageState(profile.language_preference);
            setTranslations(profile.language_preference === "ja" ? ja : en);
            localStorage.setItem("language", profile.language_preference);
          }
        }
      };
      
      checkUserPreference();
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setTranslations(lang === "ja" ? ja : en);
    localStorage.setItem("language", lang);
  };

  const t = (key: keyof typeof en | string) => {
    // Type assertion to allow string indexing
    const translationsObj = translations as Record<string, string>;
    return translationsObj[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
