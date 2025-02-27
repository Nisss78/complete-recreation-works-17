
import { productTranslations } from "./sections/products";
import { commentTranslations } from "./sections/comments";
import { followTranslations } from "./sections/follows";
import { profileTranslations } from "./sections/profile";
import { articleTranslations } from "./sections/articles";
import { error as errorTranslations } from "./sections/error";
import { settingsTranslations } from "./sections/settings";
import { bookmarksTranslations } from "./sections/bookmarks";
import { nav as navTranslations } from "./sections/nav";

export const ja = {
  // Common
  'common.loading': 'ロード中...',
  'common.error': 'エラーが発生しました',
  'common.retry': '再試行',
  'common.cancel': 'キャンセル',
  'common.save': '保存',
  'common.delete': '削除',
  'common.edit': '編集',
  'common.submit': '送信',
  'common.confirm': '確認',
  'common.search': '検索',
  'common.filters': 'フィルター',
  'common.reset': 'リセット',
  'common.apply': '適用',
  'common.more': 'もっと見る',
  'common.less': '閉じる',
  'common.or': 'または',
  'common.warning': '警告',
  'common.settings': '設定',
  'common.profile': 'プロフィール',
  'common.logout': 'ログアウト',
  'common.login': 'ログイン',
  'common.register': '新規登録',
  'common.username': 'ユーザー名',
  'common.email': 'メールアドレス',
  'common.password': 'パスワード',
  'common.passwordConfirm': 'パスワード（確認）',
  'common.name': '名前',
  'common.firstName': '名',
  'common.lastName': '姓',
  'common.home': 'ホーム',
  'common.account': 'アカウント',
  'common.privacyPolicy': 'プライバシーポリシー',
  'common.termsOfService': '利用規約',
  'common.next': '次へ',
  'common.previous': '前へ',
  'common.continue': '続ける',
  'common.finish': '完了',
  'common.notifications': '通知',
  'common.messages': 'メッセージ',
  'common.help': 'ヘルプ',
  'common.share': 'シェア',
  'common.copy': 'コピー',
  'common.back': '戻る',
  'common.others': 'その他',
  'common.show': '表示',
  'common.hide': '非表示',
  'common.all': 'すべて',
  'common.none': 'なし',
  'common.required': '必須',
  'common.optional': '任意',
  'common.empty': 'データなし',

  // Navigation
  'nav.home': 'ホーム',
  'nav.products': '製品',
  'nav.submit': '提出する',
  'nav.articles': '記事',
  'nav.bookmarks': 'ブックマーク',
  'nav.profile': 'プロフィール',
  'nav.settings': '設定',
  'nav.viewBookmarks': 'ブックマークを見る',
  'nav.myApp': 'マイアプリ',
  'nav.logout': 'ログアウト',
  'nav.login': 'ログイン',
  'nav.register': '登録',
  'nav.pricing': '料金',
  'nav.chat': 'チャット',
  ...navTranslations,

  // Auth
  'auth.signUpSuccessTitle': '登録完了',
  'auth.signUpSuccessMessage': 'アカウントが正常に作成されました。',
  'auth.loginErrorTitle': 'ログインエラー',
  'auth.loginErrorMessage': 'メールアドレスまたはパスワードが正しくありません。',
  'auth.emailExists': 'このメールアドレスは既に使用されています。',
  'auth.weakPassword': 'パスワードが弱すぎます。',
  'auth.invalidEmail': '有効なメールアドレスを入力してください。',
  'auth.passwordMismatch': 'パスワードが一致しません。',
  'auth.forgotPassword': 'パスワードをお忘れですか？',
  'auth.resetPassword': 'パスワードをリセット',
  'auth.sendResetLink': 'リセットリンクを送信',
  'auth.resetLinkSent': 'パスワードリセットリンクが送信されました。',
  'auth.requiredField': 'このフィールドは必須です。',
  'auth.or': 'または',
  'auth.signInWith': '{provider}でログイン',
  'auth.agreeToTerms': '登録することで、{terms}と{privacy}に同意したことになります。',
  'auth.termsOfService': '利用規約',
  'auth.privacyPolicy': 'プライバシーポリシー',
  'auth.alreadyHaveAccount': 'すでにアカウントをお持ちですか？',
  'auth.needAccount': 'アカウントが必要ですか？',
  'auth.createAccount': 'アカウントを作成',
  'auth.welcomeBack': 'おかえりなさい',
  'auth.createYourAccount': 'アカウントを作成',
  'auth.fillDetails': '詳細を入力してください',

  // Index
  'index.title': 'プロダクトハント - 最新のプロダクト発見プラットフォーム',
  'index.description': '最新の製品、アプリ、ウェブサイトを発見しましょう。毎日新しい製品が登場します。',
  'index.productsTitle': '今日の製品',
  'index.recentArticles': '最新の記事',
  'index.viewMore': 'もっと見る',
  'index.noProducts': '製品が見つかりませんでした',
  'index.noArticles': '記事が見つかりませんでした',
  'index.unknownUser': '不明なユーザー',

  // Products
  ...productTranslations.ja,

  // Comments
  ...commentTranslations.ja,

  // Follows
  ...followTranslations.ja,

  // Profile
  ...profileTranslations.ja,

  // Articles
  ...articleTranslations.ja,

  // Settings
  ...settingsTranslations.ja,

  // Bookmarks
  ...bookmarksTranslations.ja,

  // Errors
  ...errorTranslations.ja,

  // Success messages
  'success.completed': '完了しました',
  'success.loggedOut': 'ログアウトしました',
  'success.logoutCompleted': 'ログアウトしました',
  'success.productPosted': '製品が投稿されました',
  'success.imageUploaded': '画像がアップロードされました',
  'success.profileUpdated': 'プロフィールが更新されました',
  'success.languageUpdated': '言語が更新されました',
  'success.followed': 'フォローしました',
  'success.unfollowed': 'フォロー解除しました',

  // Error messages
  'error.productSubmission': '製品の提出中にエラーが発生しました',
  'error.productImageUpload': '製品画像のアップロード中にエラーが発生しました',
  'error.fetchProfile': 'プロフィールの取得中にエラーが発生しました',
  'error.unauthorized': '認証されていません',
  'error.imageUpload': '画像のアップロード中にエラーが発生しました',
};
