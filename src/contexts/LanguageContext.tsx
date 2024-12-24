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
    
    // Product submission
    'product.submit.title': 'Post a Product',
    'product.submit.description': 'You can edit your product anytime after posting.\nLet\'s start by sharing it!',
    'product.submit.name': 'Product Name',
    'product.submit.namePlaceholder': 'e.g. TaskFlow',
    'product.submit.tagline': 'Tagline',
    'product.submit.taglinePlaceholder': 'e.g. AI-powered success stories',
    'product.submit.description': 'Description',
    'product.submit.descriptionPlaceholder': 'Explain your product (minimum 50 characters)',
    'product.submit.link': 'Link',
    'product.submit.linkDescription': 'Link Description',
    'product.submit.tags': 'Tags',
    'product.submit.tagsPlaceholder': 'Enter new tag and press Enter',
    'product.submit.icon': 'Icon Image',
    'product.submit.iconRequirements': [
      '512×512 pixels or larger',
      'Under 2MB (PNG/JPG format)'
    ],
    'product.submit.images': 'Description Images (max 5)',
    'product.submit.imageRequirements': [
      'Click or drag & drop to upload images',
      'Under 5MB (PNG/JPG format)',
      '16:9 aspect ratio recommended'
    ],
    'product.submit.cancel': 'Cancel',
    'product.submit.post': 'Post',
    'product.submit.posting': 'Posting...',
    
    // Success messages
    'success.profileUpdated': 'Profile updated',
    'success.languageUpdated': 'Language preference updated',
    'success.productPosted': 'Product has been posted!',
    'success.imageUploaded': 'Image uploaded',
    
    // Error messages
    'error.occurred': 'An error occurred',
    'error.tryAgain': 'Please try again',
    'error.fetchProfile': 'Failed to fetch profile',
    'error.updateProfile': 'Failed to update profile',
    'error.updateLanguage': 'Failed to update language preference',
    'error.required': 'Please fill in all required fields',
    'error.upload': 'Failed to upload image',
    'error.post': 'Failed to post. Please try again.',
    'error.maxFiles': 'Maximum number of files reached',
    'error.login': 'Please login to continue'
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
    
    // Product submission
    'product.submit.title': 'プロダクトを投稿',
    'product.submit.description': '投稿したプロダクトは何度でも編集できます。\nまずは気軽に投稿してみましょう！',
    'product.submit.name': 'プロダクト名',
    'product.submit.namePlaceholder': '例: TaskFlow',
    'product.submit.tagline': 'タグライン',
    'product.submit.taglinePlaceholder': '例: 人工知能の力で、あなたの成功物語を',
    'product.submit.description': '説明',
    'product.submit.descriptionPlaceholder': 'プロダクトの概要を説明してください（50文字以上）',
    'product.submit.link': 'リンク',
    'product.submit.linkDescription': 'リンクの説明',
    'product.submit.tags': 'タグ',
    'product.submit.tagsPlaceholder': '新しいタグを入力してEnterで追加',
    'product.submit.icon': 'アイコン画像',
    'product.submit.iconRequirements': [
      '512×512ピクセル以上',
      '2MB以下（PNG/JPG形式）'
    ],
    'product.submit.images': '説明画像（最大5枚）',
    'product.submit.imageRequirements': [
      'クリックまたはドラッグ&ドロップで画像をアップロード',
      '5MB以下（PNG/JPG形式）',
      '16:9推奨'
    ],
    'product.submit.cancel': 'キャンセル',
    'product.submit.post': '投稿',
    'product.submit.posting': '投稿中...',
    
    // Success messages
    'success.profileUpdated': 'プロフィールを更新しました',
    'success.languageUpdated': '言語設定を更新しました',
    'success.productPosted': 'プロダクトが投稿されました！',
    'success.imageUploaded': '画像をアップロードしました',
    
    // Error messages
    'error.occurred': 'エラーが発生しました',
    'error.tryAgain': 'もう一度お試しください',
    'error.fetchProfile': 'プロフィールの取得に失敗しました',
    'error.updateProfile': 'プロフィールの更新に失敗しました',
    'error.updateLanguage': '言語設定の更新に失敗しました',
    'error.required': '必須項目を入力してください',
    'error.upload': '画像のアップロードに失敗しました',
    'error.post': '投稿に失敗しました。もう一度お試しください。',
    'error.maxFiles': '最大ファイル数に達しました',
    'error.login': '続行するにはログインしてください'
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