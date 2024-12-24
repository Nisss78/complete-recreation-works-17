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
  'nav.viewBookmarks': 'ブックマーク一覧を見る',
  'nav.recentBookmarks': '最近のブックマーク',
  'nav.noBookmarks': 'ブックマークはありません',
  
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

  // Success messages
  'success.profileUpdated': 'プロフィールを更新しました',
  'success.languageUpdated': '言語設定を更新しました',
  'success.productPosted': 'プロダクトが投稿されました！',
  'success.imageUploaded': '画像をアップロードしました',
  'success.loggedOut': 'ログアウト完了',
  'success.logoutCompleted': 'ログアウトしました',
  
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
  'error.login': '続行するにはログインしてください',
  'error.sessionCleared': 'セッションをクリアしました',

  // Articles
  'articles.title': '記事一覧',
  'articles.all': '全ての記事',
  'articles.following': 'フォロー中',
  'articles.noArticles': '記事が見つかりません',
  'articles.noFollowingArticles': 'フォローしているユーザーの記事はありません',
  'articles.new.title': '新規記事作成',
  'articles.new.titlePlaceholder': 'タイトルを入力',
  'articles.new.thumbnailTitle': 'サムネイル画像',
  'articles.new.thumbnailDescription': 'クリックまたはドラッグ&ドロップで画像をアップロード',
  'articles.new.thumbnailSize': '推奨サイズ: 1200×630px',
  'articles.new.cancel': 'キャンセル',
  'articles.new.post': '投稿する',
  'articles.new.posting': '投稿中...',
  'articles.postedBy': '投稿者',
  'articles.timeAgo': '{time}前',
  'articles.likes': 'いいね',
  'articles.delete': '削除',
  'articles.deleteConfirm': 'この記事を削除してもよろしいですか？',
  'articles.deleted': '記事を削除しました',
  'articles.myPosts': '投稿した記事',
  'articles.noPosts': 'まだ記事がありません',

  // Article details
  'article.details.share': 'シェア',
  'article.details.back': '戻る',
  'article.details.postedOn': '{date}に投稿',

  // Bookmarks
  'bookmarks.title': 'ブックマーク',
  'bookmarks.empty': 'ブックマークはありません',

  // Product listing
  'products.sortByLikes': 'いいね順に並び替え',
  'products.sortByDate': '投稿順に並び替え',

  // Index page
  'index.title': '本日のプロダクト | プロダクト一覧',
  'index.description': '今日立ち上がった新しいプロダクトをチェックしましょう。最新のイノベーションとクリエイティブなアイデアを発見できます。',
  'index.productsTitle': '本日のプロダクト',
  'index.recentArticles': '最近の記事',
  'index.viewMore': 'もっと見る',
  'index.unknownUser': '名前未設定',
  'index.noProducts': 'まだ投稿されたプロダクトはありません。最初の投稿者になりませんか？',
  'index.noArticles': 'まだ記事がありません',
} as const;
