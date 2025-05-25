# srcディレクトリ構成と各ファイルの役割

このドキュメントでは、`src`ディレクトリ配下の各フォルダ・ファイルの役割を詳しく説明します。

---

## 1. components/
共通UIやページごとの部品をまとめたディレクトリ。
- `ui/`：ボタンやトーストなど汎用UIコンポーネント
- `profile/`：プロフィール関連のUI
- `shared/`：複数箇所で使う共通部品
- `product-dialog/`：製品詳細ダイアログ関連
- `product-submission/`：製品投稿フォーム関連
- `comments/`：コメント表示・投稿UI
- `header/`：ヘッダーやナビゲーション
- `home/`：ホーム画面用部品
- `product-card/`：製品カード表示用部品
- `articles/`：記事関連UI
- `ProductCard.tsx`：製品カードのメイン実装
- `ProductDialog.tsx`：製品詳細ダイアログ
- `ProductSubmissionDialog.tsx`：製品投稿ダイアログ
- `Footer.tsx`：フッター
- `Header.tsx`：ヘッダー
- `MetaTags.tsx`：SEO用メタタグ

---

## 2. pages/
各ページのルートコンポーネントをまとめたディレクトリ。
- `Settings.tsx`：設定画面
- `TermsOfService.tsx`：利用規約ページ
- `article-detail/`：記事詳細ページ関連
- `MyApp.tsx`：自分のアプリ管理ページ
- `PrivacyPolicy.tsx`：プライバシーポリシーページ
- `ProductPage.tsx`：製品詳細ページ
- `Profile.tsx`：プロフィールページ
- `Auth.tsx`：認証（ログイン/サインアップ）ページ
- `Bookmarks.tsx`：ブックマーク一覧
- `Chat.tsx`：チャットページ
- `Index.tsx`：トップページ
- `Articles.tsx`：記事一覧ページ
- `ArticleDetail.tsx`：記事詳細ページ
- `ArticleNew.tsx`：記事投稿ページ

---

## 3. contexts/
グローバルな状態管理用のReact Context。
- `LanguageContext.tsx`：多言語対応のための言語状態管理

---

## 4. hooks/
カスタムフック群。主にデータ取得や状態管理を簡潔にする。
- `useProductLikes.ts`：製品のいいね管理
- `use-mobile.tsx`：モバイル判定
- `use-toast.ts`：トースト通知
- `useAllArticleBookmarks.ts`：全記事のブックマーク取得
- `useArticleBookmarks.ts`：記事のブックマーク管理
- `useArticleLikes.ts`：記事のいいね管理
- `useBookmarks.ts`：ブックマーク管理
- `useCommentLikes.ts`：コメントのいいね管理
- `useFollow.ts`：フォロー管理

---

## 5. integrations/
外部サービス連携用。
- `supabase/`：Supabaseとの連携
  - `client.ts`：Supabaseクライアント初期化
  - `types.ts`：Supabase用型定義

---

## 6. lib/
ユーティリティ関数群。
- `utils.ts`：汎用的なユーティリティ関数

---

## 7. translations/
多言語対応のための翻訳ファイル。
- `ja.ts`：日本語翻訳
- `en.ts`：英語翻訳
- `sections/`：機能ごとの翻訳ファイル（articles, bookmarks, comments, error, follows, nav, products, profile, settings, success）

---

## 8. types/
TypeScript型定義。
- `database.ts`：DBモデル型定義

---

## 9. styles/
追加CSSファイル。
- `sparkle.css`：装飾用CSS

---

## 10. 主要なルートファイル
- `main.tsx`：アプリのエントリーポイント。ReactアプリをDOMにマウント
- `App.tsx`：アプリ全体のラッパー。ルーティングやグローバルプロバイダーの設定
- `Routes.tsx`：ルーティング定義。各ページコンポーネントへのパス割り当て
- `index.css`：全体スタイル
- `App.css`：アプリ固有のスタイル
- `vite-env.d.ts`：Vite用型定義 