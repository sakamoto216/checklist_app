import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TAB_STORAGE_KEY = '@checklist_tabs';

export const useTabManager = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化：データ読み込み
  useEffect(() => {
    loadTabs();
  }, []);

  // タブデータの読み込み
  const loadTabs = async () => {
    try {
      const savedTabs = await AsyncStorage.getItem(TAB_STORAGE_KEY);
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs.tabs);
        setActiveTabId(parsedTabs.activeTabId);
      } else {
        // 初回起動時のデフォルトタブ作成
        const defaultTab = {
          id: generateTabId(),
          name: 'NEW LIST',
          tasks: []
        };
        setTabs([defaultTab]);
        setActiveTabId(defaultTab.id);
        await saveTabs([defaultTab], defaultTab.id);
      }
    } catch (error) {
      console.error('タブデータの読み込みに失敗しました:', error);
      // エラー時はデフォルトタブを作成
      const defaultTab = {
        id: generateTabId(),
        name: 'NEW LIST',
        tasks: []
      };
      setTabs([defaultTab]);
      setActiveTabId(defaultTab.id);
    } finally {
      setIsLoading(false);
    }
  };

  // タブデータの保存
  const saveTabs = async (tabsToSave, activeId) => {
    try {
      const dataToSave = {
        tabs: tabsToSave,
        activeTabId: activeId
      };
      await AsyncStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('タブデータの保存に失敗しました:', error);
    }
  };

  // ユニークなタブIDを生成
  const generateTabId = () => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // アクティブタブの変更
  const changeActiveTab = (tabId) => {
    setActiveTabId(tabId);
    saveTabs(tabs, tabId);
  };

  // 新規タブ追加
  const addTab = () => {
    const newTab = {
      id: generateTabId(),
      name: 'NEW LIST',
      tasks: []
    };
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTabId(newTab.id);
    saveTabs(updatedTabs, newTab.id);
    
    return newTab.id;
  };

  // タブ名編集
  const editTab = (tabId, newName) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === tabId ? { ...tab, name: newName } : tab
    );
    setTabs(updatedTabs);
    saveTabs(updatedTabs, activeTabId);
  };

  // タブ削除
  const deleteTab = (tabId) => {
    if (tabs.length <= 1) {
      return; // 最低1つのタブは維持
    }

    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    let newActiveTabId = activeTabId;
    
    // 削除されたタブがアクティブだった場合、別のタブをアクティブにする
    if (activeTabId === tabId) {
      newActiveTabId = updatedTabs[0]?.id || null;
    }
    
    setTabs(updatedTabs);
    setActiveTabId(newActiveTabId);
    saveTabs(updatedTabs, newActiveTabId);
  };

  // アクティブタブのタスクデータ更新
  const updateActiveTabTasks = (tasks) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, tasks } : tab
    );
    setTabs(updatedTabs);
    saveTabs(updatedTabs, activeTabId);
  };

  // アクティブタブの取得
  const getActiveTab = () => {
    return tabs.find(tab => tab.id === activeTabId) || null;
  };

  // アクティブタブのタスクデータ取得
  const getActiveTabTasks = () => {
    const activeTab = getActiveTab();
    return activeTab ? activeTab.tasks : [];
  };

  return {
    tabs,
    activeTabId,
    isLoading,
    changeActiveTab,
    addTab,
    editTab,
    deleteTab,
    updateActiveTabTasks,
    getActiveTab,
    getActiveTabTasks,
  };
};