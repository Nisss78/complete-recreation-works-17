import { commentTranslations } from './sections/comments';
import { productTranslations } from './sections/products';
import { followTranslations } from './sections/follows';
import { successTranslations } from './sections/success';

export const jaTranslations = {
  ...commentTranslations.ja,
  ...productTranslations.ja,
  ...followTranslations.ja,
  ...successTranslations.ja,
  
  // Header
  'nav.home': 'ホーム',
  'nav.articles': '記事',
  'nav.writeArticle': '記事を書く',
  'nav.post': '投稿',
  'nav.login': 'ログイン',
  'nav.settings': '設定',
  'nav.profile': 'プロフィール',
  'nav.logout': 'ログアウト',
  'nav.account': 'アカウント',
  'nav.viewBookmarks': '全て表示',
  'nav.recentBookmarks': '最近のブックマーク',
  'nav.noBookmarks': 'ブックマークはありません',
  'nav.myApp': 'マイアプリ',
  
  // Profile
  'profile.username': 'ユーザー名',
  'profile.bio': '自己紹介',
  'profile.avatar': 'アバター画像',
  'profile.socialLinks': 'ソーシャルリンク',
  'profile.save': '保存',
  'profile.usernamePlaceholder': 'あなたの名前',
  'profile.bioPlaceholder': 'あなたについて教えてください（160文字まで）',
  'profile.twitter': 'X (Twitter)',
  'profile.instagram': 'Instagram',
  'profile.github': 'GitHub',
  'profile.website': 'その他のリンク',
  'profile.posts': '投稿',
  'profile.noPosts': '投稿はありません',
  'profile.follow': 'フォロー',
  'profile.unfollow': 'フォロー解除',
  'profile.avatarUpload': 'クリックまたはドラッグ&ドロップで画像をアップロード',
  'profile.avatarSize': '2MB以下（PNG/JPG形式）',
  'profile.noAvatarSelected': '選択されていません',
  'profile.avatarPreview': 'アバタープレビュー',
  'profile.uploading': 'アップロード中...',
  'profile.twitterPlaceholder': 'https://twitter.com/yourusername',
  'profile.instagramPlaceholder': 'https://instagram.com/yourusername',
  'profile.githubPlaceholder': 'https://github.com/yourusername',
  'profile.websitePlaceholder': 'https://yourwebsite.com',
  'profile.noUsername': '名前未設定',
  'profile.edit': 'プロフィールを編集',

  // Credits
  'credits.amount': '{amount}クレジット',
  'credits.buy': 'クレジットを購入',
  'credits.monthlyPlan': '月額プラン',
  'credits.monthlyAmount': '月額1,000円で10,000クレジット',
  'credits.purchase': '購入する',
  'credits.preparingPurchase': '準備中',
  'credits.preparingDesc': 'クレジット購入機能は現在準備中です',
} as const;