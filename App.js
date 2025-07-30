import React, { useRef } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { StatusBar } from 'expo-status-bar';
import { styles } from './src/styles/styles';
import TaskItem from './src/components/TaskItem';
import FloatingTaskEditor from './src/components/FloatingTaskEditor';
import { useTasks } from './src/hooks/useTasks';
import { useKeyboard } from './src/hooks/useKeyboard';
import Footer from './src/components/Footer';

export default function App() {
  const flatListRef = useRef(null);

  // カスタムフック（3階層対応）
  const {
    tasks,
    editingId,
    editingText,
    editingLevel,
    editingParentId,
    editingGrandparentId,
    isDeleteMode,
    setEditingText,
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
  } = useTasks();

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
      />
    );
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />

          {/* メインコンテンツエリア（フッター分の余白を確保） */}
          <View style={{ flex: 1, paddingBottom: 0 }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.taskList}>
                <DraggableFlatList
                  ref={flatListRef}
                  data={tasks}
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
                  activationDistance={10}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  // パフォーマンス最適化
                  removeClippedSubviews={Platform.OS === 'android'}
                  maxToRenderPerBatch={10}
                  updateCellsBatchingPeriod={50}
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
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};