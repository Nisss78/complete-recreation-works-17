import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.articles': 'Articles',
    'nav.writeArticle': 'Write Article',
    'nav.post': 'Post',
    'nav.login': 'Login',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Settings page
    'settings.title': 'Account Settings',
    'settings.language': 'Language Preferences',
    'settings.profile': 'Profile Settings',
    'settings.selectLanguage': 'Select language',
    
    // Profile form
    'profile.username': 'Username',
    'profile.bio': 'Bio',
    'profile.avatar': 'Avatar',
    'profile.socialLinks': 'Social Links',
    'profile.save': 'Save',
    'profile.usernamePlaceholder': 'Your name',
    'profile.bioPlaceholder': 'Tell us about yourself (up to 160 characters)',
    
    // Success messages
    'success.profileUpdated': 'Profile updated',
    'success.languageUpdated': 'Language preference updated',
    
    // Error messages
    'error.occurred': 'An error occurred',
    'error.tryAgain': 'Please try again',
    'error.fetchProfile': 'Failed to fetch profile',
    'error.updateProfile': 'Failed to update profile',
    'error.updateLanguage': 'Failed to update language preference',
  },
  ja: {
    // Header
    'nav.home': 'ホーム',
    'nav.articles': '記事',
    'nav.writeArticle': '記事を書く',
    'nav.post': '投稿',
    'nav.login': 'ログイン',
    'nav.settings': '設定',
    'nav.profile': 'プロフィール',
    'nav.logout': 'ログアウト',
    
    // Settings page
    'settings.title': 'アカウント設定',
    'settings.language': '言語設定',
    'settings.profile': 'プロフィール設定',
    'settings.selectLanguage': '言語を選択',
    
    // Profile form
    'profile.username': 'ユーザー名',
    'profile.bio': '自己紹介',
    'profile.avatar': 'アバター画像',
    'profile.socialLinks': 'ソーシャルリンク',
    'profile.save': '保存',
    'profile.usernamePlaceholder': 'あなたの名前',
    'profile.bioPlaceholder': 'あなたについて教えてください（160文字まで）',
    
    // Success messages
    'success.profileUpdated': 'プロフィールを更新しました',
    'success.languageUpdated': '言語設定を更新しました',
    
    // Error messages
    'error.occurred': 'エラーが発生しました',
    'error.tryAgain': 'もう一度お試しください',
    'error.fetchProfile': 'プロフィールの取得に失敗しました',
    'error.updateProfile': 'プロフィールの更新に失敗しました',
    'error.updateLanguage': '言語設定の更新に失敗しました',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const fetchLanguagePreference = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('language_preference')
          .eq('id', session.user.id)
          .single();
        
        if (data?.language_preference) {
          setLanguageState(data.language_preference);
        }
      }
    };

    fetchLanguagePreference();
  }, []);

  const setLanguage = async (lang: string) => {
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
    } catch (error) {
      console.error('Error updating language preference:', error);
      throw error;
    }
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']] || key;
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