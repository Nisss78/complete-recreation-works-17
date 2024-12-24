export const jaTranslations = {
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
  'profile.twitter': 'Twitter URL',
  'profile.instagram': 'Instagram URL',
  'profile.github': 'GitHub URL',
  'profile.website': 'ウェブサイト URL',
  'profile.posts': '投稿',
  'profile.noPosts': '投稿はありません',
  'profile.follow': 'フォロー',
  'profile.unfollow': 'フォロー解除',
  
  // Sort options
  'sort.byLikes': 'いいね順',
  'sort.byDate': '投稿順',
  
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

  // Product submission
  'product.submit.title': 'プロダクトを投稿',
  'product.submit.description': 'あなたのプロダクトをコミュニティに共有しましょう',
  'product.submit.name': 'プロダクト名',
  'product.submit.namePlaceholder': 'プロダクト名を入力',
  'product.submit.tagline': 'タグライン',
  'product.submit.taglinePlaceholder': 'プロダクトの簡単な説明',
  'product.submit.description': '説明',
  'product.submit.descriptionPlaceholder': 'プロダクトの詳細な説明',
  'product.submit.icon': 'プロダクトアイコン',
  'product.submit.iconRequirements': '正方形の画像をアップロード\n推奨サイズ: 512x512px\n最大サイズ: 2MB',
  'product.submit.images': 'プロダクト画像',
  'product.submit.imageRequirements': '最大5枚までアップロード可能\n1枚あたり最大2MB',
  'product.submit.cancel': 'キャンセル',
  'product.submit.post': '投稿',
  'product.submit.posting': '投稿中...'
} as const;