# チェックリストアプリ - CLAUDE開発ガイド

## 🎫 【最重要】チケット駆動開発システム

**Claude Codeは必ずチケット駆動開発システムを使用して作業すること**

**⚠️ 重要**: チケットは必ず `./scripts/ticket.sh` コマンドを使用して `.tickets/` ディレクトリに作成すること。`docs/tickets/` には作成しない。

### 📌 セッション開始時の必須作業

# 1. 現在のチケット状況を確認
./scripts/ticket.sh report

# 2. TODOチケットを確認  
./scripts/ticket.sh list todo

# 3. 進行中チケットがある場合は継続確認
./scripts/ticket.sh list in-progress

### 🔄 基本ワークフロー

1. **チケット選択・開始**
   ./scripts/ticket.sh show [チケット名]
   ./scripts/ticket.sh start [チケット名]

2. **実装作業**
   - チケットの「Claude Code指示」セクションに従う
   - 受け入れ条件をチェックリストとして使用
   - 作業ログを定期的に更新

3. **作業完了**
   ./scripts/ticket.sh complete [チケット名]

### ⚠️ 厳守事項
- **新規作業前**: 既存チケットを確認、なければ作成提案
- **大きな変更**: チケット作成必須（URGENT-プレフィックスで緊急対応）
- **複数要望**: 個別にチケット化
- **チケット番号採番**: 
  - **FEAT**: `./scripts/ticket.sh list backlog | grep FEAT- | tail -1` で最新番号確認後、+1で採番
  - **BUG**: BUG-2025-001が重複のため、新規バグは **BUG-2025-011** から開始
- **状態管理厳守**: 
  - **review**: 修正実施済み、動作確認前
  - **done**: 動作確認完了後のみ移動
  - 動作確認前にdone状態にしない

**関連ドキュメント**: 
- `docs/tickets/README.md` - 詳細運用方法
- `.claude-ticket-instructions.md` - Claude Code向け詳細指示

## プロジェクト概要
React Native/Expoを使用した3階層対応のタスク管理アプリケーション。ドラッグ&ドロップによるタスクの並び替えと階層構造をサポート。

## 技術スタック
- **フレームワーク**: React Native (v0.79.5)
- **プラットフォーム**: Expo (v53.0.20)
- **言語**: JavaScript (React 19.0.0)
- **主要ライブラリ**:
  - react-native-draggable-flatlist: ドラッグ&ドロップ機能
  - react-native-gesture-handler: ジェスチャー処理
  - react-native-reanimated: アニメーション
  - react-native-safe-area-context: セーフエリア対応

## 開発コマンド
```bash
# 開発サーバー起動
npm start

# プラットフォーム別起動
npm run android  # Android
npm run ios      # iOS  
npm run web      # Web
```

## ファイル構造
```
checklist_app_new/
├── App.js                    # メインアプリケーションコンポーネント
├── src/
│   ├── components/
│   │   ├── Footer.js         # 下部固定フッター（追加・削除モード切替）
│   │   ├── TaskInput.js      # タスク入力コンポーネント
│   │   └── TaskItem.js       # タスクアイテム表示・編集
│   ├── hooks/
│   │   ├── useKeyboard.js    # キーボード表示時のスクロール制御
│   │   └── useTasks.js       # タスク管理ロジック（3階層対応）
│   └── styles/
│       └── styles.js         # アプリケーション全体のスタイル定義
└── package.json
```

## 主要機能
1. **3階層タスク管理**: 親 → 子 → 孫の階層構造
2. **ドラッグ&ドロップ**: タスクの並び替えと階層移動
3. **リアルタイム編集**: インライン編集機能
4. **削除モード**: バッチ削除機能
5. **キーボード対応**: 自動スクロールとレイアウト調整

## 開発時の注意点
- タスクの階層構造は3階層まで対応（level: 0, 1, 2）
- ドラッグ操作時のパフォーマンス最適化済み
- キーボード表示時の自動スクロール機能実装済み
- SafeAreaに対応したレイアウト設計

## デバッグとテスト
- Expo DevToolsを使用してデバッグ
- 物理デバイスまたはシミュレータでテスト
- ジェスチャー機能は実機でのテストを推奨

## トラブルシューティング
- ドラッグ機能が動作しない場合: `react-native-gesture-handler`の設定を確認
- キーボード表示時のレイアウト崩れ: `KeyboardAvoidingView`の設定を調整
- パフォーマンス問題: `DraggableFlatList`の最適化オプションを確認