import { commentTranslations } from './sections/comments';
import { productTranslations } from './sections/products';
import { followTranslations } from './sections/follows';
import { successTranslations } from './sections/success';

export const enTranslations = {
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
  'nav.viewBookmarks': 'View All Bookmarks',
  'nav.recentBookmarks': 'Recent Bookmarks',
  'nav.noBookmarks': 'No bookmarks yet',
  
  // Settings page
  'settings.title': 'Account Settings',
  'settings.language': 'Language Preferences',
  'settings.profile': 'Profile Settings',
  'settings.selectLanguage': 'Select language',
  'settings.profileSettings': 'Profile Settings',
  
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
  'profile.avatarSize': 'Max 2MB (PNG/JPG format)',
  'profile.noAvatarSelected': 'No image selected',
  'profile.avatarPreview': 'Avatar Preview',
  'profile.uploading': 'Uploading...',
  'profile.twitterPlaceholder': 'https://twitter.com/yourusername',
  'profile.instagramPlaceholder': 'https://instagram.com/yourusername',
  'profile.githubPlaceholder': 'https://github.com/yourusername',
  'profile.websitePlaceholder': 'https://yourwebsite.com',

  // Success messages
  'success.profileUpdated': 'Profile updated',
  'success.languageUpdated': 'Language preference updated',
  'success.productPosted': 'Product has been posted!',
  'success.imageUploaded': 'Image uploaded',
  'success.loggedOut': 'Logged out',
  'success.logoutCompleted': 'You have been logged out successfully',
  'success.completed': 'Completed',
  
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
  'error.login': 'Please login to continue',
  'error.sessionCleared': 'Session has been cleared',

  // Articles
  'articles.title': 'Articles',
  'articles.all': 'All Articles',
  'articles.following': 'Following',
  'articles.noArticles': 'No articles found',
  'articles.noFollowingArticles': 'No articles from followed users',
  'articles.new.title': 'Write New Article',
  'articles.new.titlePlaceholder': 'Enter title',
  'articles.new.thumbnailTitle': 'Thumbnail Image',
  'articles.new.thumbnailDescription': 'Click or drag & drop to upload image',
  'articles.new.thumbnailSize': 'Recommended size: 1200×630px',
  'articles.new.cancel': 'Cancel',
  'articles.new.post': 'Post',
  'articles.new.posting': 'Posting...',
  'articles.postedBy': 'Posted by',
  'articles.timeAgo': '{time} ago',
  'articles.likes': 'likes',
  'articles.delete': 'Delete',
  'articles.deleteConfirm': 'Are you sure you want to delete this article?',
  'articles.deleted': 'Article deleted successfully',
  'articles.myPosts': 'My Posts',
  'articles.noPosts': 'No posts yet',

  // Article details
  'article.details.share': 'Share',
  'article.details.back': 'Back',
  'article.details.postedOn': 'Posted on {date}',

  // Bookmarks
  'bookmarks.title': 'Bookmarks',
  'bookmarks.empty': 'No bookmarks yet',

  // Product listing
  'products.sortByLikes': 'Sort by Likes',
  'products.sortByDate': 'Sort by Date',

  // Index page
  'index.title': 'Products Launching Today | Product List',
  'index.description': 'Check out new products launching today. Discover the latest innovations and creative ideas.',
  'index.productsTitle': 'Products Launching Today',
  'index.recentArticles': 'Recent Articles',
  'index.viewMore': 'View More',
  'index.unknownUser': 'Unknown User',
  'index.noProducts': 'No products have been posted yet. Would you like to be the first to post?',
  'index.noArticles': 'No articles yet',
} as const;
