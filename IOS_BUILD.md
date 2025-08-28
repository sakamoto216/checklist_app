# iOS ビルド手順

## 事前準備

### 1. Apple Developer Account
- [Apple Developer Program](https://developer.apple.com/programs/) に登録（年間 $99）
- Paid Developer Account が必要

### 2. Expoアカウント設定
```bash
eas login
```

### 3. EAS Build設定（完了済み）
- `eas.json` にiOSビルド設定を追加済み
- `package.json` にiOSビルドスクリプトを追加済み

## iOSビルド手順

### プレビュー版（テスト用）
```bash
npm run build:ios:preview
# または
eas build -p ios --profile preview
```

### 本番版（App Store用）
```bash
npm run build:ios:production
# または
eas build -p ios --profile production
```

## Apple Developer Account 設定

### 1. Certificates & Identifiers
1. [Apple Developer Console](https://developer.apple.com/account/) にログイン
2. **Certificates, Identifiers & Profiles** を選択
3. **App IDs** で新しいApp IDを作成:
   - Bundle ID: `com.kouhei_sakamoto.nestlist`
   - App Name: `Nest List`

### 2. Provisioning Profiles
EAS Buildが自動的に作成・管理します

## App Store Connect 設定

### 1. 新しいアプリを作成
1. [App Store Connect](https://appstoreconnect.apple.com/) にログイン
2. **マイApp** → **＋** → **新しいApp**
3. 基本情報:
   - **名前**: Nest List
   - **Bundle ID**: com.kouhei_sakamoto.nestlist
   - **SKU**: nestlist-ios
   - **ユーザーアクセス**: 制限なし

### 2. アプリ情報設定
#### 基本情報
- **説明**: 3階層対応のタスク管理アプリ
- **キーワード**: タスク管理,生産性,整理,リスト,TODO
- **サポートURL**: （個人サイトまたはGitHub）
- **プライバシーポリシー**: （GOOGLE_PLAY_STORE.mdと同じ内容をウェブサイトに掲載）

#### スクリーンショット
- **iPhone 6.7"**: 1290×2796px（必須）
- **iPhone 6.5"**: 1242×2688px（推奨）
- **iPad Pro 12.9"**: 2048×2732px（iPad対応時）

#### アプリアイコン
- **1024×1024px** PNG（透過なし）

### 3. 価格設定
- **価格**: 無料
- **配信地域**: 全世界

## TestFlight（ベータテスト）

### 1. 内部テスト
```bash
# プレビュービルドをTestFlightに送信
eas submit -p ios --latest
```

### 2. 外部テスト
1. App Store Connect でTestFlight設定
2. テスターを追加（最大10,000人）
3. ベータ版審査申請

## App Store審査・公開

### 1. 本番ビルド作成
```bash
npm run build:ios:production
```

### 2. App Store Connect に送信
```bash
eas submit -p ios --latest
```

### 3. 審査申請
1. App Store Connect でリリース準備
2. 審査申請（通常1-7日）
3. 承認後、自動または手動でリリース

## 重要な注意事項

1. **Apple Developer Account必須**: 有料アカウント（$99/年）が必要
2. **Bundle ID**: 一意である必要があり、変更不可
3. **証明書管理**: EAS Buildが自動管理（推奨）
4. **審査ガイドライン**: Apple App Store Review Guidelines準拠
5. **プライバシー**: iOS 14.5以降、App Tracking Transparency対応

## トラブルシューティング

### ビルドエラー
```bash
# キャッシュクリアして再ビルド
eas build -p ios --profile preview --clear-cache
```

### 証明書エラー
```bash
# 証明書管理
eas credentials
```

### Bundle ID競合
- Apple Developer Console で別のBundle IDを作成
- `app.json` の `expo.ios.bundleIdentifier` を更新

## 参考リンク
- [EAS Build iOS](https://docs.expo.dev/build-reference/ios-builds/)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)