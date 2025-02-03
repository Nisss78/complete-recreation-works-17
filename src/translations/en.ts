import { commentTranslations } from './sections/comments';
import { productTranslations } from './sections/products';
import { followTranslations } from './sections/follows';
import { successTranslations } from './sections/success';

export const enTranslations = {

  // Common
  'common.loading': 'Loading...',

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
  
  // Settings page
  'settings.title': 'Account Settings',
  'settings.language': 'Language Preferences',
  'settings.profile': 'Profile Settings',
  'settings.selectLanguage': 'Select language',
  'settings.profileSettings': 'Profile Settings',
  
  // Profile
  'profile.followers': 'Followers',
  'profile.following': 'Following',
  'profile.noFollowers': 'No followers yet',
  'profile.noFollowing': 'Not following anyone yet',

  // Profile form
  'profile.username': 'Username',
  'profile.bio': 'Bio',
  'profile.avatar': 'Avatar',
  'profile.socialLinks': 'Social Links',
  'profile.save': 'Save',
  'profile.usernamePlaceholder': 'Your name',
  'profile.bioPlaceholder': 'Tell us about yourself (up to 160 characters)',
  'profile.twitter': 'X (Twitter)',
  'profile.instagram': 'Instagram',
  'profile.github': 'GitHub',
  'profile.website': 'Other Links',
  'profile.posts': 'Posts',
  'profile.noPosts': 'No posts yet',
  'profile.follow': 'Follow',
  'profile.unfollow': 'Unfollow',
  'profile.avatarUpload': 'Click or drag & drop to upload image',
  'profile.avatarSize': '2MB or less (PNG/JPG format)',
  'profile.noAvatarSelected': 'No image selected',
  'profile.avatarPreview': 'Avatar Preview',
  'profile.uploading': 'Uploading...',
  'profile.twitterPlaceholder': 'https://twitter.com/yourusername',
  'profile.instagramPlaceholder': 'https://instagram.com/yourusername',
  'profile.githubPlaceholder': 'https://github.com/yourusername',
  'profile.websitePlaceholder': 'https://yourwebsite.com',
  'profile.noUsername': 'No username',
  'profile.edit': 'Edit profile',

  // Credits
  'credits.amount': '{amount} Credits',
  'credits.buy': 'Buy Credits',
  'credits.monthlyPlan': 'Monthly Plan',
  'credits.monthlyAmount': '10,000 credits for $10/month',
  'credits.purchase': 'Purchase',
  'credits.preparingPurchase': 'Purchase feature coming soon',
  'credits.preparingDesc': 'Credit purchase feature is currently in development',
} as const;
