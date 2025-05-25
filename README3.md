# 記事カード・製品カードの構造と仕組み詳細

このドキュメントでは、記事カード（ArticleCard）と製品カード（ProductCard）の仕組み・構造・関連コンポーネント・データの流れについて詳しく解説します。

---

## 1. 記事カード（ArticleCard）の構造と仕組み

### 概要
- 記事カードは、記事一覧やトップページの最新記事リストなどで1つの記事をカード形式で表示するコンポーネントです。
- 主な要素：タイトル、著者情報、サムネイル、いいね数、ブックマーク、投稿日、削除ボタン（権限があれば）など。

### 主な構成
- `ArticleCard.tsx`：記事カード本体。クリックで記事詳細ページへ遷移。
  - `ArticleHeader.tsx`：カード上部のレイアウト（サムネイル、タイトル、著者、日付、いいね・ブックマークボタン、削除ボタン）
  - `useArticleLikes.ts`：いいね状態・数の管理（Supabaseと連携し、リアルタイム反映）
  - `useArticleBookmarks.ts`：ブックマーク状態の管理
  - 著者名クリックでプロフィールページへ遷移
  - 削除ボタンは管理者や投稿者のみ表示

### データの流れ
1. 親コンポーネント（例：Articles.tsx）がSupabaseから記事リストを取得し、各記事ごとに`<ArticleCard />`を描画。
2. `ArticleCard`はpropsで記事ID・タイトル・著者・いいね数などを受け取る。
3. `useArticleLikes`・`useArticleBookmarks`で、現在のユーザーがいいね・ブックマーク済みか判定し、状態を管理。
4. いいね・ブックマークボタン押下時はSupabaseの該当テーブルを更新し、UIも即時反映。
5. サムネイルや著者情報はprops経由で`ArticleHeader`に渡され、レイアウトされる。

### 関連テーブル
- articles
- article_likes
- article_bookmarks
- profiles（著者情報）

---

## 2. 製品カード（ProductCard）の構造と仕組み

### 概要
- 製品カードは、トップページや製品一覧で1つのプロダクトをカード形式で表示するコンポーネントです。
- 主な要素：製品名、キャッチコピー、アイコン、タグ、いいね数、コメント数、アクションボタン群。

### 主な構成
- `ProductCard.tsx`：製品カード本体。クリックで製品詳細ダイアログを開く。
  - `ProductActions.tsx`：いいね・コメント・ブックマーク・シェア・統計ボタン群
  - `useProductLikes.ts`：いいね状態・数の管理（Supabaseと連携し、リアルタイム反映）
  - `useBookmarks.ts`：ブックマーク状態の管理
  - コメント数はリアルタイムで取得・監視
  - 製品クリックで詳細ダイアログ（ProductDialog）を表示

### データの流れ
1. 親コンポーネント（例：ProductsList.tsx）がSupabaseから製品リストを取得し、各製品ごとに`<ProductCard />`を描画。
2. `ProductCard`はpropsで製品ID・名前・キャッチコピー・タグ・コメント数などを受け取る。
3. `useProductLikes`・`useBookmarks`で、現在のユーザーがいいね・ブックマーク済みか判定し、状態を管理。
4. いいね・ブックマークボタン押下時はSupabaseの該当テーブルを更新し、UIも即時反映。
5. コメント数はSupabaseのリアルタイムチャネルで監視し、変化があれば自動で再取得。
6. 製品クリックで詳細ダイアログ（ProductDialog）が開き、詳細情報やコメントセクションを表示。

### 関連テーブル
- products
- product_likes
- product_bookmarks
- product_comments
- product_tags
- product_images

---

## 3. 製品カードと記事カードのつながり・全体構造

- トップページ（Index.tsx）では、左側に製品リスト（ProductsList）、右側に最新記事リスト（RecentArticles）を表示。
- 製品リストは日付ごとにグループ化され、各日付ごとに複数の`ProductCard`が並ぶ。
- 最新記事リストは最大3件の`ArticleCard`をサイドバー表示。
- 製品カードをクリックすると`ProductDialog`が開き、詳細情報・画像カルーセル・コメントセクション（CommentSection）などが表示される。
- 記事カードをクリックすると記事詳細ページへ遷移。
- どちらも「いいね」「ブックマーク」などのアクションはSupabaseの該当テーブルを即時更新し、リアルタイムでUIに反映。
- コメントやリプライも同様にSupabaseを介して管理される。

---

## 4. 主要な関連コンポーネント・フックまとめ

- `ArticleCard`・`ProductCard`：カード本体
- `ArticleHeader`・`ProductHeader`：カード上部のレイアウト
- `ProductActions`：製品カードのアクションボタン群
- `useArticleLikes`・`useProductLikes`：いいね管理
- `useArticleBookmarks`・`useBookmarks`：ブックマーク管理
- `ProductDialog`：製品詳細ダイアログ
- `CommentSection`・`CommentItem`：コメント表示・投稿
- `ProductsList`・`RecentArticles`：リスト表示

---

## 5. データベースとの連携・リアルタイム性

- いいね・ブックマーク・コメント数はSupabaseのリアルタイムチャネルで監視し、他ユーザーの操作も即時反映。
- 認証状態もSupabaseで管理し、未ログイン時はアクション時にログインを促すトーストを表示。
- コメント投稿・リプライ・削除もSupabase経由で即時反映。

---

このように、記事カード・製品カードはそれぞれ独立しつつも、トップページや詳細ダイアログ・コメント機能などで密接につながり、リアルタイムなユーザー体験を実現しています。