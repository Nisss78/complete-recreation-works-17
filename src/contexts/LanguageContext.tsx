
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { en } from '@/translations/en';
import { ja } from '@/translations/ja';

export type Language = 'en' | 'ja';

// TranslationKeyは全ての翻訳キーの型
type TranslationKey = keyof typeof en;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const fetchLanguagePreference = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('language_preference')
          .eq('id', session.user.id)
          .single();
        
        if (data?.language_preference && 
            (data.language_preference === 'en' || data.language_preference === 'ja')) {
          setLanguageState(data.language_preference);
        }
      }
    };

    fetchLanguagePreference();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ language_preference: lang })
          .eq('id', session.user.id);

        if (error) throw error;
      }
      setLanguageState(lang);
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating language preference:', error);
      return Promise.reject(error);
    }
  };

  const t = (key: string): string => {
    const translations = language === 'en' ? en : ja;
    // @ts-ignore - we use string index access
    const translated = translations[key];
    return translated || en[key as keyof typeof en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
