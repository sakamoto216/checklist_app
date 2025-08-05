import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// デフォルト設定値
const DEFAULT_SETTINGS = {
  // 外観設定
  theme: 'light', // light, dark, system
  accentColor: '#DA7B39', // オレンジ系
  fontSize: 'medium', // small, medium, large
  
  // 操作設定
  dragSensitivity: 100, // 長押し時間 (ms)
  swipeSensitivity: 40, // スワイプ閾値
  autoSave: true, // 自動保存
  
  // 表示設定
  showCompletedTasks: true, // 完了タスク表示
  indentWidth: 20, // インデント幅 (px)
  showTaskNumbers: false, // タスク番号表示
  
  // 機能設定
  confirmDelete: true, // 削除確認
  enableBulkActions: true, // 一括操作
  keyboardShortcuts: true, // ショートカット
  
  // データ管理
  autoBackup: false, // 自動バックアップ
  backupFrequency: 'daily', // daily, weekly, monthly
};

const SETTINGS_KEY = '@app_settings';

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // 設定を読み込み
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // デフォルト設定とマージして、新しい設定項目が追加された場合に対応
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 設定を保存
  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
    }
  };

  // 特定の設定項目を更新
  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  // 設定をデフォルトにリセット
  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('設定のリセットに失敗しました:', error);
    }
  };

  // 設定をエクスポート
  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  // 設定をインポート
  const importSettings = async (settingsJson) => {
    try {
      const importedSettings = JSON.parse(settingsJson);
      // バリデーション
      const validatedSettings = { ...DEFAULT_SETTINGS, ...importedSettings };
      await saveSettings(validatedSettings);
      return true;
    } catch (error) {
      console.error('設定のインポートに失敗しました:', error);
      return false;
    }
  };

  // 設定値の取得用ヘルパー関数
  const getSetting = (key) => {
    return settings[key];
  };

  // フォントサイズの数値変換
  const getFontSizeValue = () => {
    switch (settings.fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.1;
      default: return 1.0;
    }
  };

  // テーマ色の取得
  const getThemeColors = () => {
    const baseColors = {
      primary: settings.accentColor,
      background: settings.theme === 'dark' ? '#1a1a1a' : '#ffffff',
      text: settings.theme === 'dark' ? '#ffffff' : '#333333',
      border: settings.theme === 'dark' ? '#444444' : '#dddddd',
    };
    return baseColors;
  };

  // 初回読み込み
  useEffect(() => {
    loadSettings();
  }, []);

  return {
    // 状態
    settings,
    isLoading,
    
    // アクション
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
    
    // ヘルパー
    getSetting,
    getFontSizeValue,
    getThemeColors,
    
    // 定数
    DEFAULT_SETTINGS,
  };
};