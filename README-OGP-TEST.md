# 🖼️ OGP画像テストガイド

このドキュメントでは、ProtductのOGP画像生成機能のテスト方法を説明します。

## 📋 テスト概要

### 実装されている機能
- **動的OGP画像生成**: Canvas APIで1200x630px画像を生成
- **記事・製品対応**: 異なるタイプのコンテンツに対応
- **美しいデザイン**: グラデーション背景とクリーンなレイアウト
- **パフォーマンス**: 24時間キャッシュで高速配信

## 🚀 テスト方法

### 1. ローカルテストページ
```bash
# demo/ogp-test.html をブラウザで開く
open demo/ogp-test.html
```

### 2. 直接URLテスト

#### 記事用OGP画像
```
https://viaxlwsbhrzwheekrycv.supabase.co/functions/v1/generate-ogp?type=article&title=サンプル記事&author=著者名&service=Protoduct
```

#### 製品用OGP画像
```
https://viaxlwsbhrzwheekrycv.supabase.co/functions/v1/generate-ogp?type=product&name=製品名&tags=AI,開発&service=Protoduct
```

## 🔧 テスト項目チェックリスト

### ✅ 基本機能テスト
- [ ] 記事OGP画像が正常に生成される
- [ ] 製品OGP画像が正常に生成される
- [ ] 日本語テキストが正しく表示される
- [ ] 長いテキストが適切に省略される
- [ ] グラデーション背景が美しく表示される

### ✅ エラーハンドリングテスト
- [ ] パラメータなしでもエラーにならない
- [ ] 不正なtypeパラメータでも適切に処理される
- [ ] 特殊文字が含まれたテキストも正常処理される

### ✅ パフォーマンステスト
- [ ] 画像生成が3秒以内に完了する
- [ ] キャッシュが正常に動作する
- [ ] 複数同時リクエストでも安定している

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. 画像が表示されない
```bash
# Edge Functionがデプロイされているか確認
supabase functions list

# ログを確認
supabase functions logs generate-ogp
```

#### 2. 日本語が文字化けする
- フォント設定を確認
- エンコーディングをチェック

#### 3. 生成が遅い
- キャッシュ設定を確認
- Canvas処理の最適化を検討

## 📊 テスト結果記録

### 最終テスト日: [日付を記入]

| テスト項目 | 結果 | 備考 |
|-----------|------|------|
| 記事OGP生成 | ✅/❌ | |
| 製品OGP生成 | ✅/❌ | |
| 日本語表示 | ✅/❌ | |
| レスポンス時間 | ✅/❌ | |
| キャッシュ動作 | ✅/❌ | |

## 🔄 継続的テスト

### デプロイ前チェック
```bash
# 1. Edge Functionをデプロイ
supabase functions deploy generate-ogp

# 2. テストページで動作確認
npm run dev
# → http://localhost:5173/demo/ogp-test.html

# 3. 本番環境での確認
curl -I "https://viaxlwsbhrzwheekrycv.supabase.co/functions/v1/generate-ogp?type=article&title=テスト"
```

### 定期メンテナンス
- 月1回: パフォーマンス確認
- 機能追加時: 全項目テスト
- 問題報告時: 即座に調査

## 📞 サポート

問題が発生した場合は、以下の情報と一緒にお知らせください：
- テスト環境（ブラウザ、OS）
- エラーメッセージ
- 実行したURL
- 期待する結果と実際の結果 