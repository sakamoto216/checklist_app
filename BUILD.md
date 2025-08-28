# Android APKビルド手順

## 事前準備

1. Expoアカウントでログイン
```bash
eas login
```

2. プロジェクトをExpo Organizationに関連付け
```bash
eas build:configure
```

## APKビルド手順

### プレビュー版APK（テスト用）
```bash
npm run build:android:preview
# または
eas build -p android --profile preview
```

### 本番版APK
```bash
npm run build:android:production  
# または
eas build -p android --profile production
```

## ビルド設定

- **development**: 開発版（Development Client用）
- **preview**: プレビュー版（内部テスト用APK）
- **production**: 本番版（App Bundle形式）

## 注意事項

- EAS Buildはクラウドビルドサービスです
- 初回ビルドには10-15分程度かかります
- ビルド完了後、APKダウンロードリンクが提供されます
- ビルド状況は [EAS Build Dashboard](https://expo.dev/builds) で確認できます