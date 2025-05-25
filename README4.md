# OGP（Open Graph Protocol）による記事・製品のSNS共有方針

## 目的

- 記事や製品をSNS（X, Facebook, LINEなど）で共有した際、サムネイル画像・タイトル・説明文がリッチに表示されるようにしたい。
- 特に記事の場合は、記事ごとに個別のサムネイル画像（OGP画像）を自動生成・設定し、SNS上で目立つ形で拡散されることを目指す。

---

## OGPとは？

- OGP（Open Graph Protocol）は、WebページのメタデータをSNS等でリッチに表示するための仕組み。
- 代表的なOGPタグ：
  - `og:title`（タイトル）
  - `og:description`（説明文）
  - `og:image`（サムネイル画像URL）
  - `og:url`（ページURL）
- これらをHTMLの`<head>`内に記述することで、SNSでのシェア時にカード形式で表示される。

---

## 新しい実装方針（2024/06修正版）

### OGP専用HTMLエンドポイント方式
- SPA（Vite/React）ではクローラーがOGPタグを認識できないため、
  サーバーレス関数等で`/ogp/articles/[id]`や`/ogp/products/[id]`のようなOGP専用HTMLエンドポイントを用意する。
- このエンドポイントはOGPタグ付きの静的HTMLを返し、クローラーにはOGP情報を、一般ユーザーには`<meta http-equiv="refresh">`でSPA本体にリダイレクトする。
- OGP画像は既存の画像生成APIを利用。
- SNSシェアボタンのリンク先はこのOGP専用エンドポイントにする。

---

## 実装ステップ

1. Supabase Edge FunctionsやVercel OG ImageでOGP画像生成APIを用意
2. OGP専用HTMLエンドポイント（例：`/ogp/articles/[id]`）をサーバーレス関数で実装
3. SNSシェアボタンのリンク先をOGP専用エンドポイントに変更
4. 主要SNSでの表示確認・デザイン調整

---

## 補足・注意点

- SPAのままでもSNSで正しいOGPカードが表示できる唯一の現実的な方法。
- OGP画像は「テンプレートカード画像」をAPIで動的に生成し、記事・製品ごとにテキストだけを差し替える。
- サービス名やタグ・著者名などもカード内に含めることで、SNS上での訴求力と統一感を両立。
