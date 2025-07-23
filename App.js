import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { StatusBar } from 'expo-status-bar';
import { styles } from './src/styles/styles';
import TaskInput from './src/components/TaskInput';

export default function App() {
  // 基本状態
  const [tasks, setTasks] = useState([]);

  // 編集状態
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);

  // 削除モード状態
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // 新しいタスクを追加（空の編集状態で）
  const addTask = () => {
    const newTask = {
      id: Date.now().toString(),
      text: '',
      completed: false,
      children: [],
    };

    // 親タスクとして追加
    setTasks(currentTasks => [...currentTasks, newTask]);

    // 親タスクの編集モードを開始
    setEditingId(newTask.id);
    setEditingText('');
    setIsEditingChild(false);
    setEditingParentId(null);
  };

  // 編集関連
  const startEditing = (taskId, currentText, isChild = false, parentId = null) => {
    // 削除モード中は編集不可
    if (isDeleteMode) return;

    setEditingId(taskId);
    setEditingText(currentText);
    setIsEditingChild(isChild);
    setEditingParentId(parentId);
  };

  const cancelEditing = () => {
    // 編集中のアイテムが空文字の場合は削除
    if (editingId && editingText.trim() === '') {
      deleteTask(editingId, isEditingChild, editingParentId);
    }

    setEditingId(null);
    setEditingText('');
    setIsEditingChild(false);
    setEditingParentId(null);
  };

  const saveEdit = () => {
    if (editingText.trim() === '') {
      // 空の場合は削除
      deleteTask(editingId, isEditingChild, editingParentId);
      cancelEditing();
      return;
    }

    if (isEditingChild) {
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === editingParentId
          ? {
            ...task,
            children: task.children.map(child =>
              child.id === editingId
                ? { ...child, text: editingText.trim() }
                : child
            )
          }
          : task
      ));
    } else {
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === editingId
          ? { ...task, text: editingText.trim() }
          : task
      ));
    }

    cancelEditing();
  };

  const toggleParentSelection = (parentId) => {
    // 削除モード中は親選択不可
    if (isDeleteMode) return;

    // 直接子タスクを追加して編集モードに入る
    const newChildTask = {
      id: Date.now().toString(),
      text: '',
      completed: false,
      children: [],
    };

    setTasks(currentTasks => currentTasks.map(task =>
      task.id === parentId
        ? { ...task, children: [...task.children, newChildTask] }
        : task
    ));

    // 子タスクの編集モードを開始
    setEditingId(newChildTask.id);
    setEditingText('');
    setIsEditingChild(true);
    setEditingParentId(parentId);
  };

  const toggleTask = (taskId, isChild = false, parentId = null) => {
    // 削除モード中はチェック不可
    if (isDeleteMode) return;

    if (isChild) {
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === parentId
          ? {
            ...task,
            children: task.children.map(child =>
              child.id === taskId
                ? { ...child, completed: !child.completed }
                : child
            )
          }
          : task
      ));
    } else {
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      ));
    }
  };

  const deleteTask = (taskId, isChild = false, parentId = null) => {
    if (isChild) {
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === parentId
          ? {
            ...task,
            children: task.children.filter(child => child.id !== taskId)
          }
          : task
      ));
    } else {
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      // 削除したタスクが選択中の親だった場合、選択を解除
      if (selectedParentId === taskId) {
        setSelectedParentId(null);
      }
    }
  };

  // 削除モードの切り替え
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    // 削除モードを開始する時は、編集モードを解除
    if (!isDeleteMode) {
      cancelEditing();
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragEnd = ({ data }) => {
    setTasks(data);
  };

  // タスクアイテムのレンダリング
  const renderTaskItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View style={[
          styles.taskContainer,
          isActive && styles.taskContainerActive,
          isDeleteMode && styles.taskContainerDeleteMode
        ]}>
          <View style={[
            styles.parentTaskItem,
            isDeleteMode && styles.parentTaskItemDeleteMode
          ]}>
            {/* 削除モード時の削除ボタン */}
            {isDeleteMode && (
              <TouchableOpacity
                style={styles.deleteModeButton}
                onPress={() => deleteTask(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteModeButtonText}>✕</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.checkboxContainer,
                isDeleteMode && styles.checkboxContainerDisabled
              ]}
              onPress={() => toggleTask(item.id)}
              activeOpacity={isDeleteMode ? 1 : 0.7}
              disabled={isDeleteMode}
            >
              <View style={[
                styles.checkbox,
                item.completed && styles.checkboxCompleted,
                isDeleteMode && styles.checkboxDisabled
              ]}>
                <Text style={styles.checkboxText}>
                  {item.completed ? '✓' : ''}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.taskTextContainer}>
              {editingId === item.id ? (
                <TextInput
                  style={styles.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                  onSubmitEditing={saveEdit}
                  onBlur={cancelEditing}
                  autoFocus
                />
              ) : (
                <TouchableOpacity
                  style={[
                    styles.taskTextTouchable,
                    isDeleteMode && styles.taskTextTouchableDisabled
                  ]}
                  onPress={() => startEditing(item.id, item.text)}
                  activeOpacity={isDeleteMode ? 1 : 0.7}
                  disabled={isDeleteMode}
                >
                  <Text style={[
                    styles.taskText,
                    item.completed && styles.taskTextCompleted,
                    isDeleteMode && styles.taskTextDisabled
                  ]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 通常モード時のボタン群 */}
            {!isDeleteMode && editingId !== item.id && (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => toggleParentSelection(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ドラッグハンドル */}
            {!isDeleteMode && (
              <TouchableOpacity
                style={styles.dragHandle}
                onLongPress={drag}
                delayLongPress={100}
              >
                <Text style={styles.dragHandleText}>⋮⋮</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 子タスク一覧 */}
          {item.children && item.children.length > 0 && !isActive && (
            <View style={styles.childrenContainer}>
              {item.children.map((child) => (
                <View key={child.id} style={styles.childTaskContainer}>
                  <View style={[
                    styles.childTaskItem,
                    isDeleteMode && styles.childTaskItemDeleteMode
                  ]}>
                    {/* 子タスクの削除ボタン */}
                    {isDeleteMode && (
                      <TouchableOpacity
                        style={styles.deleteModeButtonChild}
                        onPress={() => deleteTask(child.id, true, item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.deleteModeButtonTextChild}>✕</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.checkboxContainerChild,
                        isDeleteMode && styles.checkboxContainerDisabled
                      ]}
                      onPress={() => toggleTask(child.id, true, item.id)}
                      activeOpacity={isDeleteMode ? 1 : 0.7}
                      disabled={isDeleteMode}
                    >
                      <View style={[
                        styles.checkbox,
                        styles.checkboxChild,
                        child.completed && styles.checkboxCompleted,
                        isDeleteMode && styles.checkboxDisabled
                      ]}>
                        <Text style={[styles.checkboxText, styles.checkboxTextChild]}>
                          {child.completed ? '✓' : ''}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={[styles.taskTextContainer, styles.taskTextContainerChild]}>
                      {editingId === child.id ? (
                        <TextInput
                          style={[styles.editInput, styles.editInputChild]}
                          value={editingText}
                          onChangeText={setEditingText}
                          onSubmitEditing={saveEdit}
                          onBlur={cancelEditing}
                          autoFocus
                        />
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.taskTextTouchable,
                            styles.taskTextTouchableChild,
                            isDeleteMode && styles.taskTextTouchableDisabled
                          ]}
                          onPress={() => startEditing(child.id, child.text, true, item.id)}
                          activeOpacity={isDeleteMode ? 1 : 0.7}
                          disabled={isDeleteMode}
                        >
                          <Text style={[
                            styles.taskText,
                            styles.taskTextChild,
                            child.completed && styles.taskTextCompleted,
                            isDeleteMode && styles.taskTextDisabled
                          ]}>
                            {child.text}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>持ち物チェックリスト</Text>

        {/* 削除モード表示 */}
        {isDeleteMode && (
          <View style={styles.deleteModeIndicator}>
            <Text style={styles.deleteModeText}>
              🗑️ 削除モード - 削除したい項目の「✕」をタップ
            </Text>
          </View>
        )}

        {/* 使用方法の説明 */}
        {!isDeleteMode && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              💡 右下の「+」で新規追加 / 項目の「+」で子追加 / 「⋮⋮」長押しで並び替え
            </Text>
          </View>
        )}

        {/* DraggableFlatList */}
        <DraggableFlatList
          data={tasks}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          containerStyle={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          activationDistance={10}
          dragItemOverflow={true}
          // 削除モード時はドラッグ無効
          scrollEnabled={!isDeleteMode}
        />

        {/* フローティングボタン群 */}
        {/* 追加ボタン */}
        {!isDeleteMode && (
          <TouchableOpacity
            style={styles.floatingAddButton}
            onPress={addTask}
            activeOpacity={0.7}
          >
            <Text style={styles.floatingAddButtonText}>+</Text>
          </TouchableOpacity>
        )}

        {/* 削除モード切り替えボタン */}
        <TouchableOpacity
          style={[
            styles.floatingDeleteButton,
            isDeleteMode && styles.floatingDeleteButtonActive
          ]}
          onPress={toggleDeleteMode}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.floatingDeleteButtonText,
            isDeleteMode && styles.floatingDeleteButtonTextActive
          ]}>
            {isDeleteMode ? '✓' : '🗑'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}