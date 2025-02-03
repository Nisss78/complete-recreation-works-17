import { commentTranslations } from './sections/comments';
import { productTranslations } from './sections/products';
import { followTranslations } from './sections/follows';
import { successTranslations } from './sections/success';

export const enTranslations = {
  // Common
  'common.loading': 'Loading...',

  // Chat
  'chat.title': 'Chat',
  'chat.placeholder': 'Type your message...',
  'chat.send': 'Send',
  'chat.noMessages': 'No messages yet. Start a conversation!',

  ...commentTranslations.en,
  ...productTranslations.en,
  ...followTranslations.en,
  ...successTranslations.en,
  
  // Header
  'nav.home': 'Home',
  'nav.articles': 'Articles',
  'nav.writeArticle': 'Write Article',
  'nav.post': 'Post',
  'nav.login': 'Login',
  'nav.settings': 'Settings',
  'nav.profile': 'Profile',
  'nav.logout': 'Logout',
  'nav.account': 'Account',
  'nav.viewBookmarks': 'View All',
  'nav.recentBookmarks': 'Recent Bookmarks',
  'nav.noBookmarks': 'No bookmarks yet',
  'nav.myApp': 'My App',
  'nav.chat': 'Chat',
} as const;
