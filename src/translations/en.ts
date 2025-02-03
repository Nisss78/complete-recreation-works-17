import { commentTranslations } from './sections/comments';
import { productTranslations } from './sections/products';
import { followTranslations } from './sections/follows';
import { successTranslations } from './sections/success';

export const enTranslations = {
  // Common
  'common.loading': 'Loading...',

  // Error messages
  'error.occurred': 'An error occurred',
  'error.tryAgain': 'Please try again',
  'error.upload': 'Failed to upload file',
  'error.required': 'Required fields are missing',
  'error.post': 'Failed to post',
  'error.adminRequired': 'Admin privileges required',
  'error.fetchProfile': 'Failed to fetch profile',
  'error.updateLanguage': 'Failed to update language preference',

  // Settings
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.selectLanguage': 'Select language',
  'settings.profile': 'Profile',
  'settings.profileSettings': 'Profile Settings',

  // Profile
  'profile.username': 'Username',
  'profile.bio': 'Bio',
  'profile.avatar': 'Avatar',
  'profile.socialLinks': 'Social Links',
  'profile.save': 'Save',
  'profile.usernamePlaceholder': 'Enter your username',
  'profile.bioPlaceholder': 'Tell us about yourself (max 160 characters)',
  'profile.twitter': 'Twitter',
  'profile.instagram': 'Instagram',
  'profile.github': 'GitHub',
  'profile.website': 'Website',
  'profile.twitterPlaceholder': 'https://twitter.com/yourusername',
  'profile.instagramPlaceholder': 'https://instagram.com/yourusername',
  'profile.githubPlaceholder': 'https://github.com/yourusername',
  'profile.websitePlaceholder': 'https://yourwebsite.com',
  'profile.noUsername': 'No username set',
  'profile.edit': 'Edit Profile',
  'profile.followers': 'Followers',
  'profile.following': 'Following',
  'profile.noFollowers': 'No followers yet',
  'profile.noFollowing': 'Not following anyone',
  'profile.avatarUpload': 'Click or drag & drop to upload',
  'profile.avatarSize': 'Max 2MB (PNG/JPG)',
  'profile.uploading': 'Uploading...',

  // Credits
  'credits.amount': '{amount} Credits',
  'credits.buy': 'Buy Credits',
  'credits.monthlyPlan': 'Monthly Plan',
  'credits.monthlyAmount': '10,000 credits for $10/month',
  'credits.purchase': 'Purchase',
  'credits.preparingPurchase': 'Preparing Purchase',
  'credits.preparingDesc': 'Credit purchase feature is coming soon',

  // Articles
  'articles.title': 'Articles',
  'articles.all': 'All',
  'articles.following': 'Following',
  'articles.myPosts': 'My Posts',
  'articles.noPosts': 'No posts yet',
  'articles.noArticles': 'No articles found',
  'articles.noFollowingArticles': 'No articles from people you follow',
  'articles.new.cancel': 'Cancel',
  'articles.new.post': 'Post',
  'articles.new.posting': 'Posting...',
  'articles.new.titlePlaceholder': 'Enter article title',
  'articles.new.thumbnailTitle': 'Thumbnail',
  'articles.new.thumbnailDescription': 'Add a cover image to your article',
  'articles.new.thumbnailSize': 'Max size: 2MB',

  // Article Details
  'article.details.back': 'Back',
  'article.details.postedOn': 'Posted on',
  'article.details.share': 'Share',

  // Products
  'products.sortByDate': 'Latest',
  'products.sortByLikes': 'Most Liked',

  // Product Details
  'product.details.loginRequired': 'Login Required',
  'product.details.loginRequiredDesc': 'Please login to continue',
  'product.details.like': 'Like',
  'product.details.bookmarkRemoved': 'Bookmark Removed',
  'product.details.bookmarkAdded': 'Bookmark Added',
  'product.details.bookmarkRemovedDesc': 'Product removed from bookmarks',
  'product.details.bookmarkAddedDesc': 'Product added to bookmarks',
  'product.details.linkCopied': 'Link Copied',
  'product.details.linkCopiedDesc': 'Product link copied to clipboard',
  'product.details.visit': 'Visit',

  // Index
  'index.title': 'Welcome to Protoduct',
  'index.description': 'Discover and share amazing products',
  'index.productsTitle': 'Featured Products',
  'index.noProducts': 'No products found',
  'index.recentArticles': 'Recent Articles',
  'index.viewMore': 'View More',
  'index.unknownUser': 'Unknown User',
  'index.noArticles': 'No articles yet',

  // Bookmarks
  'bookmarks.title': 'Bookmarks',
  'bookmarks.empty': 'No bookmarks yet',

  // Chat
  'chat.title': 'Chat',
  'chat.placeholder': 'Type your message...',
  'chat.send': 'Send',
  'chat.noMessages': 'No messages yet. Start a conversation!',

  // Navigation
  'nav.home': 'Home',
  'nav.articles': 'Articles',
  'nav.writeArticle': 'Write Article',
  'nav.post': 'Post',
  'nav.login': 'Login',
  'nav.settings': 'Settings',
  'nav.profile': 'Profile',
  'nav.logout': 'Logout',
  'nav.account': 'Account',
  'nav.viewBookmarks': 'View Bookmarks',
  'nav.recentBookmarks': 'Recent Bookmarks',
  'nav.noBookmarks': 'No bookmarks yet',
  'nav.myApp': 'My App',
  'nav.chat': 'Chat',

  ...commentTranslations.en,
  ...productTranslations.en,
  ...followTranslations.en,
  ...successTranslations.en,
} as const;