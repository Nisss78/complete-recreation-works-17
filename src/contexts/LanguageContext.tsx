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
    'nav.articles': 'Articles',
    'nav.writeArticle': 'Write Article',
    'nav.post': 'Post',
    'nav.login': 'Login',
    
    // Articles page
    'articles.title': 'Articles',
    'articles.all': 'All',
    'articles.following': 'Following',
    'articles.noArticles': 'No articles found',
    'articles.noFollowingArticles': 'No articles from followed users',
    
    // Article interactions
    'article.like': 'Like',
    'article.liked': 'Liked',
    'article.delete': 'Delete',
    'article.deleteConfirm': 'Are you sure you want to delete this article?',
    'article.deleted': 'Article deleted',
    'article.deleteError': 'Error deleting article',
    
    // Comments
    'comments.title': 'Comments',
    'comments.post': 'Post',
    'comments.posting': 'Posting...',
    'comments.placeholder': 'Write a comment...',
    'comments.none': 'No comments yet. Be the first to comment!',
    
    // Auth messages
    'auth.required': 'Login required',
    'auth.likeLogin': 'Please login to like articles',
    'auth.commentLogin': 'Please login to comment',
    
    // Success messages
    'success.commentPosted': 'Comment posted',
    'success.liked': 'Article liked',
    'success.unliked': 'Article unliked',
    
    // Error messages
    'error.occurred': 'An error occurred',
    'error.tryAgain': 'Please try again',
  },
  ja: {
    // Header
    'nav.articles': '記事',
    'nav.writeArticle': '記事を書く',
    'nav.post': '投稿',
    'nav.login': 'ログイン',
    
    // Articles page
    'articles.title': '記事一覧',
    'articles.all': 'すべて',
    'articles.following': 'フォロー中',
    'articles.noArticles': '記事がありません',
    'articles.noFollowingArticles': 'フォローしているユーザーの記事がありません',
    
    // Article interactions
    'article.like': 'いいね',
    'article.liked': 'いいね済み',
    'article.delete': '削除',
    'article.deleteConfirm': 'この記事を削除してもよろしいですか？',
    'article.deleted': '記事を削除しました',
    'article.deleteError': '記事の削除に失敗しました',
    
    // Comments
    'comments.title': 'コメント',
    'comments.post': '投稿',
    'comments.posting': '投稿中...',
    'comments.placeholder': 'コメントを投稿...',
    'comments.none': 'まだコメントはありません。最初のコメントを投稿してみましょう！',
    
    // Auth messages
    'auth.required': 'ログインが必要です',
    'auth.likeLogin': 'いいねをするにはログインしてください',
    'auth.commentLogin': 'コメントを投稿するにはログインしてください',
    
    // Success messages
    'success.commentPosted': 'コメントを投稿しました',
    'success.liked': 'いいね！',
    'success.unliked': 'いいねを取り消しました',
    
    // Error messages
    'error.occurred': 'エラーが発生しました',
    'error.tryAgain': 'もう一度お試しください',
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await supabase
        .from('profiles')
        .update({ language_preference: lang })
        .eq('id', session.user.id);
    }
    setLanguageState(lang);
  };

  const t = (key: string) => {
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