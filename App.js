import React, { useRef } from 'react';
import { Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { StatusBar } from 'expo-status-bar';
import { styles } from './src/styles/styles';
import TaskInput from './src/components/TaskInput';
import TaskItem from './src/components/TaskItem';
import { useTasks } from './src/hooks/useTasks';
import { useKeyboard } from './src/hooks/useKeyboard';
import Footer from './src/components/Footer';

export default function App() {
  const flatListRef = useRef(null);

  // カスタムフック
  const {
    tasks,
    editingId,
    editingText,
    isDeleteMode,
    setEditingText,
    addTask,
    startEditing,
    cancelEditing,
    saveEdit,
    toggleParentSelection,
    toggleTask,
    deleteTask,
    toggleDeleteMode,
    handleDragEnd,
    handleDragBegin,
    handleChildDragEnd,
    promoteChildToParent,
    demoteParentToChild,
  } = useTasks();

  const {
    keyboardHeight,
    scrollToEditingItem,
    scrollToNewTask,
    handleScrollToIndexFailed,
  } = useKeyboard(flatListRef, tasks);

  // タスク追加ハンドラー
  const handleAddTask = () => {
    addTask(scrollToNewTask);
  };

  // 編集開始ハンドラー
  const handleStartEditing = (taskId, currentText, isChild = false, parentId = null) => {
    startEditing(taskId, currentText, isChild, parentId, scrollToEditingItem);
  };

  // 子タスク追加ハンドラー
  const handleToggleParentSelection = (parentId) => {
    toggleParentSelection(parentId, scrollToEditingItem);
  };

  // タスクアイテムのレンダリング
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
        onToggleParentSelection={handleToggleParentSelection}
        onDemoteParentToChild={demoteParentToChild}
        onPromoteChildToParent={promoteChildToParent}
        onChildDragEnd={handleChildDragEnd}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" translucent={false} />
        <SafeAreaView style={styles.container}>
          {/* 削除モード表示 */}
          {isDeleteMode && (
            <View style={styles.deleteModeIndicator}>
              <Text style={styles.deleteModeText}>
                🗑️ 削除モード - 削除したい項目の「✕」をタップ
              </Text>
            </View>
          )}

          {/* 使用方法の説明 */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              • タスクをタップして編集 • +ボタンで子タスク追加 • 長押しで並び替え • スワイプで親子関係変更
            </Text>
          </View>

          {/* キーボード対応のコンテナ */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
          >
            {/* DraggableFlatList */}
            <DraggableFlatList
              ref={flatListRef}
              data={tasks}
              onDragEnd={handleDragEnd}
              onDragBegin={handleDragBegin}
              keyExtractor={(item) => item.id}
              renderItem={renderTaskItem}
              containerStyle={styles.taskList}
              contentContainerStyle={[
                styles.taskListContent,
                {
                  paddingBottom: Platform.OS === 'android'
                    ? Math.max(90, keyboardHeight > 0 ? 40 : 90)
                    : Math.max(70, keyboardHeight > 0 ? 20 : 70)
                }
              ]}
              activationDistance={15}
              dragItemOverflow={false}
              scrollEnabled={!isDeleteMode}
              showsVerticalScrollIndicator={false}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              getItemLayout={(data, index) => ({
                length: 60,
                offset: 60 * index,
                index,
              })}
              removeClippedSubviews={false}
              maintainVisibleContentPosition={null}
            />
          </KeyboardAvoidingView>

          {/* フッター */}
          <Footer
            isDeleteMode={isDeleteMode}
            onAddTask={handleAddTask}
            onToggleDeleteMode={toggleDeleteMode}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}