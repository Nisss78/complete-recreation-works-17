import { commentTranslations } from './sections/comments';
import { productTranslations } from './sections/products';
import { followTranslations } from './sections/follows';

export const jaTranslations = {
  ...commentTranslations.ja,
  ...productTranslations.ja,
  ...followTranslations.ja,
  
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

  // Bookmarks
  'bookmarks.title': 'ブックマーク',
  'bookmarks.empty': 'ブックマークはありません',

  // Product listing
  'products.sortByLikes': 'いいね順に並び替え',
  'products.sortByDate': '投稿順に並び替え',

  // Product details
  'product.details.visit': '訪問',

  // Article details
  'article.details.share': 'シェア',
  'article.details.back': '戻る',
  'article.details.postedOn': '{date}に投稿',

  // Settings
  'settings.profileSettings': 'プロフィール設定',

  'product.details.like': 'いいね',
  'product.details.likes': 'いいね',
  'product.details.comment': 'コメント',
  'product.details.comments': 'コメント',
  'product.details.bookmark': 'ブックマーク',
  'product.details.share': 'シェア',
  'product.details.stats': '統計',
  'product.details.linkCopied': 'リンクをコピーしました',
  'product.details.linkCopiedDesc': 'クリップボードにURLをコピーしました',
  'product.details.bookmarkAdded': 'ブックマークに追加しました',
  'product.details.bookmarkRemoved': 'ブックマークを解除しました',
  'product.details.bookmarkAddedDesc': '{name}をブックマークに追加しました',
  'product.details.bookmarkRemovedDesc': '{name}のブックマークを解除しました',
  'product.details.loginRequired': 'ログインが必要です',
  'product.details.loginRequiredDesc': 'この機能を使用するにはログインしてください',

  // New translations
  'avatar.upload.completed': 'アップロード完了',
  'avatar.upload.completed.description': 'アバター画像のアップロードが完了しました',
  'avatar.upload.failed': 'エラー',
  'avatar.upload.failed.description': '画像のアップロードに失敗しました',
  'avatar.upload.uploading': 'アップロード中...',
  'avatar.upload.clickOrDrag': 'クリックまたはドラッグ&ドロップで画像をアップロード',
  'avatar.upload.sizeLimit': '2MB以下（PNG/JPG形式）',
  'profile.update.success': 'プロフィールを更新しました',
  'profile.update.success.description': 'プロフィール画像を更新しました',
  'profile.update.failed': 'エラーが発生しました',
  'profile.update.failed.description': '画像のアップロードに失敗しました。もう一度お試しください。',
  'profile.noName': '名前未設定',
  'profile.edit': 'プロフィールを編集',
  'profile.daysAgo': '{days}日前',
  'profile.postedArticles': '投稿した記事',
  'profile.noArticlesYet': 'まだ記事がありません',
  'profile.loginRequired': 'ログインが必要です',
  'profile.loginRequired.description': '続行するにはログインしてください',
  'profile.noChanges': '変更なし',
  'profile.noChanges.description': 'プロフィールに変更はありませんでした',
} as const;
