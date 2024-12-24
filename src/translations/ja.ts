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
  
  // Articles
  'articles.title': '記事一覧',
  'articles.all': '全ての記事',
  'articles.following': 'フォロー中',
  'articles.noArticles': '記事がありません',
  'articles.noFollowingArticles': 'フォローしているユーザーの記事がありません',
  
  // Product submission
  'product.submit.title': 'プロダクトを投稿',
  'product.submit.description': '投稿したプロダクトは何度でも編集できます。\nまずは気軽に投稿してみましょう！',
  'product.submit.name': 'プロダクト名',
  'product.submit.namePlaceholder': '例: TaskFlow',
  'product.submit.tagline': 'タグライン',
  'product.submit.taglinePlaceholder': '例: 人工知能の力で、あなたの成功物語を',
  'product.submit.description': '説明',
  'product.submit.descriptionPlaceholder': 'プロダクトの概要を説明してください（50文字以上）',
  'product.submit.link': 'リンク',
  'product.submit.linkDescription': 'リンクの説明',
  'product.submit.tags': 'タグ',
  'product.submit.tagsPlaceholder': '新しいタグを入力してEnterで追加',
  'product.submit.icon': 'アイコン画像',
  'product.submit.iconRequirements': '512×512ピクセル以上の画像をアップロード\n2MB以下、PNG/JPG形式',
  'product.submit.images': '説明画像（最大5枚）',
  'product.submit.imageRequirements': 'クリックまたはドラッグ&ドロップで画像をアップロード\n5MB以下、PNG/JPG形式、16:9推奨',
  'product.submit.cancel': 'キャンセル',
  'product.submit.post': '投稿',
  'product.submit.posting': '投稿中...',
  
  // Success messages
  'success.profileUpdated': 'プロフィールを更新しました',
  'success.languageUpdated': '言語設定を更新しました',
  'success.productPosted': 'プロダクトが投稿されました！',
  'success.imageUploaded': '画像をアップロードしました',
  
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
  'error.login': '続行するにはログインしてください'
} as const;