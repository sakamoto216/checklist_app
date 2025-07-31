import React, { useRef, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { StatusBar } from 'expo-status-bar';
import { styles } from './src/styles/styles';
import TaskItem from './src/components/TaskItem';
import FloatingTaskEditor from './src/components/FloatingTaskEditor';
import TabBar from './src/components/TabBar';
import SettingsModal from './src/components/SettingsModal';
import { useTasks } from './src/hooks/useTasks';
import { useTabManager } from './src/hooks/useTabManager';
import { useKeyboard } from './src/hooks/useKeyboard';
import { useSettings } from './src/hooks/useSettings';
import Footer from './src/components/Footer';

export default function App() {
  const flatListRef = useRef(null);

  // 設定管理
  const {
    settings,
    isLoading: isSettingsLoading,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettings();

  // 設定モーダルの状態
  const [isSettingsModalVisible, setIsSettingsModalVisible] = React.useState(false);

  // タブマネージャー
  const {
    tabs,
    activeTabId,
    isLoading,
    changeActiveTab,
    addTab,
    editTab,
    deleteTab,
    updateActiveTabTasks,
    getActiveTabTasks,
  } = useTabManager();

  // カスタムフック（3階層対応）- タブ対応のため初期データは空で開始
  const {
    tasks,
    editingId,
    editingText,
    editingLevel,
    editingParentId,
    editingGrandparentId,
    isDeleteMode,
    setEditingText,
    setTasks,
    addTask,
    startEditing,
    cancelEditing,
    saveEdit,
    addChildTask,
    toggleTask,
    deleteTask,
    toggleDeleteMode,
    handleDragEnd,
    handleDragBegin,
    handleChildDragEnd,
    promoteTask,
    demoteTask,
    checkAllTasks,
    uncheckAllTasks,
  } = useTasks();

  // アクティブタブのタスクデータをuseTasksに同期
  useEffect(() => {
    if (!isLoading && activeTabId) {
      const activeTabTasks = getActiveTabTasks();
      setTasks(activeTabTasks);

      // リストが空の場合、未入力のタスクを自動作成（編集モードは開始しない）
      if (activeTabTasks.length === 0) {
        addTask(null, false);
      }
    }
  }, [activeTabId, isLoading]);

  // タスクが変更されたときにタブデータを更新
  useEffect(() => {
    if (!isLoading && activeTabId) {
      updateActiveTabTasks(tasks);
    }
  }, [tasks]);

  const {
    keyboardHeight,
    scrollToEditingItem,
    scrollToNewTask,
    handleScrollToIndexFailed,
  } = useKeyboard(flatListRef, tasks);

  // 編集中タスクの詳細情報を取得する関数
  const getEditingTaskDetails = () => {
    if (!editingId) return null;

    // 親タスクから検索
    for (const task of tasks) {
      if (task.id === editingId) {
        return { task, level: 0, parentId: null, grandparentId: null };
      }

      // 子タスクから検索
      if (task.children) {
        for (const child of task.children) {
          if (child.id === editingId) {
            return { task: child, level: 1, parentId: task.id, grandparentId: null };
          }

          // 孫タスクから検索
          if (child.children) {
            for (const grandchild of child.children) {
              if (grandchild.id === editingId) {
                return { task: grandchild, level: 2, parentId: child.id, grandparentId: task.id };
              }
            }
          }
        }
      }
    }

    return null;
  };

  const editingTaskDetails = getEditingTaskDetails();

  // タスク追加ハンドラー（フローティング表示版）
  const handleAddTask = () => {
    addTask(() => {
      // フローティング表示のためスクロール処理は無効化
      // 代わりにFloatingTaskEditorが自動表示される
    });
  };

  // 編集開始ハンドラー（3階層対応・フローティング版）
  const handleStartEditing = (taskId, currentText, level = 0, parentId = null, grandparentId = null) => {
    startEditing(taskId, currentText, level, parentId, grandparentId, () => {
      // フローティング表示のためスクロール処理は無効化
    });
  };

  // 子タスク追加ハンドラー（3階層対応・フローティング版）
  const handleAddChildTask = (parentId, level = 1, grandparentId = null) => {
    addChildTask(parentId, level, grandparentId, () => {
      // フローティング表示のためスクロール処理は無効化
    });
  };

  // 昇格ハンドラー（3階層対応）
  const handlePromoteTask = (taskId, currentLevel, parentId = null, grandparentId = null) => {
    promoteTask(taskId, currentLevel, parentId, grandparentId);
  };

  // 降格ハンドラー（3階層対応）
  const handleDemoteTask = (taskId, currentLevel, parentId = null, grandparentId = null) => {
    demoteTask(taskId, currentLevel, parentId, grandparentId);
  };

  // タスクの存在チェック（全件チェック機能用）
  const hasTasksToCheck = () => {
    const countTasks = (taskList) => {
      let count = 0;
      for (const task of taskList) {
        // 空のタスクは除外
        if (task.text && task.text.trim()) {
          count++;
        }
        if (task.children) {
          count += countTasks(task.children);
        }
      }
      return count;
    };
    return countTasks(tasks) > 0;
  };

  // タスクのフィルタリング（完了タスク表示設定に基づく）
  const filteredTasks = tasks.filter(task => {
    if (settings.showCompletedTasks) return true;
    // 完了タスクを非表示にする場合、本文が空でない未完了タスクのみ表示
    return !task.completed && task.text && task.text.trim();
  });

  // タスクアイテムのレンダリング（3階層対応）
  const renderTaskItem = (props) => {
    return (
      <TaskItem
        {...props}
        isDeleteMode={isDeleteMode}
        editingId={editingId}
        editingText={editingText}
        setEditingText={setEditingText}
        onStartEditing={handleStartEditing}
        onSaveEdit={saveEdit}
        onCancelEditing={cancelEditing}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onAddChildTask={handleAddChildTask}
        onDemoteTask={handleDemoteTask}
        onPromoteTask={handlePromoteTask}
        onChildDragEnd={handleChildDragEnd}
        onDragEnd={handleDragEnd}
        level={0} // 親レベル
        parentId={null}
        grandparentId={null}
        hideEditingTask={true} // フローティング中は編集中タスクを非表示
        dragSensitivity={settings.dragSensitivity}
        showTaskNumbers={settings.showTaskNumbers}
        showCompletedTasks={settings.showCompletedTasks}
        swipeSensitivity={settings.swipeSensitivity}
      />
    );
  };

  // ローディング中の表示（設定とタブの両方）
  if (isLoading || isSettingsLoading) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#DA7B39" />
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />

          {/* タブバー */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={changeActiveTab}
            onAddTab={addTab}
            onEditTab={editTab}
            onDeleteTab={deleteTab}
            isDeleteMode={isDeleteMode}
            keyboardHeight={keyboardHeight}
          />

          {/* メインコンテンツエリア（フッター分の余白を確保） */}
          <View style={{
            flex: 1,
            paddingBottom: 0,
            backgroundColor: '#777777',
            marginHorizontal: -15, // コンテナのpaddingを相殺して画面幅いっぱいに
            paddingTop: 12,
          }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={[styles.taskList, { paddingHorizontal: 15 }]}>
                <DraggableFlatList
                  ref={flatListRef}
                  data={filteredTasks}
                  onDragEnd={handleDragEnd}
                  onDragBegin={handleDragBegin}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTaskItem}
                  contentContainerStyle={[
                    styles.taskListContent,
                    {
                      // フッター分の余白 + キーボード対応
                      paddingBottom: Platform.OS === 'android'
                        ? Math.max(80, keyboardHeight > 0 ? keyboardHeight * 0.1 + 80 : 80)
                        : Math.max(70, keyboardHeight > 0 ? 70 : 70)
                    }
                  ]}
                  onScrollToIndexFailed={handleScrollToIndexFailed}
                  // ジェスチャー競合解決のための設定
                  activationDistance={10} // ドラッグ開始距離を短縮（15→10）
                  dragHitSlop={{ top: 5, bottom: 5, left: -10, right: -10 }} // より広い当たり判定
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  // 縦スクロール優先のための設定
                  bounces={true} // iOSでのバウンス効果を有効にしてスクロールを促進
                  bouncesZoom={false}
                  decelerationRate="normal" // スクロールの減速率を標準に
                  // パフォーマンス最適化
                  removeClippedSubviews={false} // ドラッグ時のパフォーマンス向上のため無効化
                  maxToRenderPerBatch={5} // バッチサイズを適度に増やして安定性向上
                  updateCellsBatchingPeriod={50} // 更新頻度を下げて安定性向上
                  getItemLayout={null} // 動的レンダリングを有効化
                  windowSize={15} // メモリ使用量とパフォーマンスのバランス
                  // ドラッグ&ドロップの追加最適化
                  dragItemOverflow={true} // ドラッグ中のアイテムがコンテナ外に出ることを許可
                  animationConfig={{
                    easing: 'ease-out', // よりスムーズなアニメーション
                    duration: 200,
                  }}
                  // キーボード表示時のスクロール調整
                  automaticallyAdjustKeyboardInsets={false} // 手動制御
                  maintainVisibleContentPosition={
                    editingId ? {
                      minIndexForVisible: 0,
                      autoscrollToTopThreshold: 10
                    } : null
                  }
                />
              </View>
            </KeyboardAvoidingView>
          </View>

          {/* フッター（SafeAreaView外に配置して固定） */}
          <Footer
            isDeleteMode={isDeleteMode}
            onAddTask={handleAddTask}
            onToggleDeleteMode={toggleDeleteMode}
            onCheckAllTasks={settings.enableBulkActions ? checkAllTasks : null}
            onUncheckAllTasks={settings.enableBulkActions ? uncheckAllTasks : null}
            onOpenSettings={() => setIsSettingsModalVisible(true)}
            hasTasksToCheck={hasTasksToCheck()}
            enableBulkActions={settings.enableBulkActions}
          />
        </SafeAreaView>

        {/* フローティングタスクエディター */}
        <FloatingTaskEditor
          visible={!!editingTaskDetails}
          task={editingTaskDetails?.task}
          editingText={editingText}
          setEditingText={setEditingText}
          onSaveEdit={saveEdit}
          onCancelEditing={cancelEditing}
          keyboardHeight={keyboardHeight}
          level={editingTaskDetails?.level || 0}
        />

        {/* 設定モーダル */}
        <SettingsModal
          visible={isSettingsModalVisible}
          onClose={() => setIsSettingsModalVisible(false)}
          settings={settings}
          updateSetting={updateSetting}
          resetSettings={resetSettings}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};