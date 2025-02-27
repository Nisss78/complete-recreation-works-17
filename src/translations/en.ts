
import { productTranslations } from "./sections/products";
import { commentTranslations } from "./sections/comments";
import { followTranslations } from "./sections/follows";
import { profileTranslations } from "./sections/profile";
import { articleTranslations } from "./sections/articles";
import { errorTranslations } from "./sections/error";
import { settingsTranslations } from "./sections/settings";
import { bookmarksTranslations } from "./sections/bookmarks";
import { navTranslations } from "./sections/nav";

export const en = {
  // Common
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.retry': 'Retry',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.submit': 'Submit',
  'common.confirm': 'Confirm',
  'common.search': 'Search',
  'common.filters': 'Filters',
  'common.reset': 'Reset',
  'common.apply': 'Apply',
  'common.more': 'More',
  'common.less': 'Less',
  'common.or': 'or',
  'common.warning': 'Warning',
  'common.settings': 'Settings',
  'common.profile': 'Profile',
  'common.logout': 'Logout',
  'common.login': 'Login',
  'common.register': 'Register',
  'common.username': 'Username',
  'common.email': 'Email',
  'common.password': 'Password',
  'common.passwordConfirm': 'Confirm Password',
  'common.name': 'Name',
  'common.firstName': 'First Name',
  'common.lastName': 'Last Name',
  'common.home': 'Home',
  'common.account': 'Account',
  'common.privacyPolicy': 'Privacy Policy',
  'common.termsOfService': 'Terms of Service',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.continue': 'Continue',
  'common.finish': 'Finish',
  'common.notifications': 'Notifications',
  'common.messages': 'Messages',
  'common.help': 'Help',
  'common.share': 'Share',
  'common.copy': 'Copy',
  'common.back': 'Back',
  'common.others': 'Others',
  'common.show': 'Show',
  'common.hide': 'Hide',
  'common.all': 'All',
  'common.none': 'None',
  'common.required': 'Required',
  'common.optional': 'Optional',
  'common.empty': 'No data',

  // Navigation
  'nav.home': 'Home',
  'nav.products': 'Products',
  'nav.submit': 'Submit',
  'nav.articles': 'Articles',
  'nav.bookmarks': 'Bookmarks',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  'nav.viewBookmarks': 'View Bookmarks',
  'nav.myApp': 'My App',
  'nav.logout': 'Logout',
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.pricing': 'Pricing',
  'nav.chat': 'Chat',
  ...navTranslations.en,

  // Auth
  'auth.signUpSuccessTitle': 'Registration Complete',
  'auth.signUpSuccessMessage': 'Your account has been successfully created.',
  'auth.loginErrorTitle': 'Login Error',
  'auth.loginErrorMessage': 'Incorrect email or password.',
  'auth.emailExists': 'This email is already in use.',
  'auth.weakPassword': 'Password is too weak.',
  'auth.invalidEmail': 'Please enter a valid email address.',
  'auth.passwordMismatch': 'Passwords do not match.',
  'auth.forgotPassword': 'Forgot password?',
  'auth.resetPassword': 'Reset Password',
  'auth.sendResetLink': 'Send Reset Link',
  'auth.resetLinkSent': 'Password reset link has been sent.',
  'auth.requiredField': 'This field is required.',
  'auth.or': 'or',
  'auth.signInWith': 'Sign in with {provider}',
  'auth.agreeToTerms': 'By signing up, you agree to our {terms} and {privacy}.',
  'auth.termsOfService': 'Terms of Service',
  'auth.privacyPolicy': 'Privacy Policy',
  'auth.alreadyHaveAccount': 'Already have an account?',
  'auth.needAccount': 'Need an account?',
  'auth.createAccount': 'Create Account',
  'auth.welcomeBack': 'Welcome Back',
  'auth.createYourAccount': 'Create Your Account',
  'auth.fillDetails': 'Please fill in the details below',

  // Index
  'index.title': 'Product Hunt - The best new products in tech',
  'index.description': 'Discover the latest products, apps, and websites. New products launched every day.',
  'index.productsTitle': 'Today\'s Products',
  'index.recentArticles': 'Recent Articles',
  'index.viewMore': 'View More',
  'index.noProducts': 'No products found',
  'index.noArticles': 'No articles found',
  'index.unknownUser': 'Unknown User',

  // Products
  ...productTranslations.en,

  // Comments
  ...commentTranslations.en,

  // Follows
  ...followTranslations.en,

  // Profile
  ...profileTranslations.en,

  // Articles
  ...articleTranslations.en,

  // Settings
  ...settingsTranslations.en,

  // Bookmarks
  ...bookmarksTranslations.en,

  // Errors
  ...errorTranslations.en,

  // Success messages
  'success.completed': 'Completed successfully',
  'success.loggedOut': 'Logged out successfully',
  'success.logoutCompleted': 'Logged out successfully',
  'success.productPosted': 'Product posted successfully',
  'success.imageUploaded': 'Image uploaded successfully',
  'success.profileUpdated': 'Profile updated successfully',
  'success.languageUpdated': 'Language updated successfully',
  'success.followed': 'Successfully followed user',
  'success.unfollowed': 'Successfully unfollowed user',

  // Error messages
  'error.productSubmission': 'Error submitting product',
  'error.productImageUpload': 'Error uploading product image',
  'error.fetchProfile': 'Error fetching profile',
  'error.unauthorized': 'You are not authorized',
  'error.imageUpload': 'Error uploading image',
};
