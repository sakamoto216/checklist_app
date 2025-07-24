import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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

  // ドラッグ&ドロップ処理（親タスク）
  const handleDragEnd = ({ data }) => {
    setTasks(data);
  };

  // 子タスクのドラッグ&ドロップ処理
  const handleChildDragEnd = (parentId, newChildrenData) => {
    setTasks(currentTasks => currentTasks.map(task =>
      task.id === parentId
        ? { ...task, children: newChildrenData }
        : task
    ));
  };

  // 子タスクを親タスクに移動
  const promoteChildToParent = (childId, parentId) => {
    let childTask = null;

    // 子タスクを取得して親から削除
    setTasks(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === parentId) {
          const child = task.children.find(c => c.id === childId);
          if (child) {
            childTask = { ...child, children: [] }; // 子タスクの子は引き継がない
          }
          return {
            ...task,
            children: task.children.filter(c => c.id !== childId)
          };
        }
        return task;
      });
    });

    // 子タスクを親タスクとして追加
    if (childTask) {
      setTasks(currentTasks => [...currentTasks, childTask]);
    }
  };

  // 親タスクを直上の親の子にする
  const demoteParentToChild = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex <= 0) return; // 最初のタスクまたは見つからない場合は何もしない

    const targetTask = tasks[taskIndex];
    const parentTask = tasks[taskIndex - 1];

    // タスクを親から削除して、直上の親の子として追加
    setTasks(currentTasks => {
      const newTasks = currentTasks.filter(task => task.id !== taskId);
      return newTasks.map(task =>
        task.id === parentTask.id
          ? { ...task, children: [...task.children, { ...targetTask, children: [] }] }
          : task
      );
    });
  };

  // 右スワイプアクション（親タスク化） - 表示のみ
  const renderRightAction = (childId, parentId) => {
    return (
      <View style={styles.promoteAction}>
        <Text style={styles.promoteActionText}>親に</Text>
        <Text style={styles.promoteActionIcon}>↗️</Text>
      </View>
    );
  };

  // 左スワイプアクション（子タスク化） - 表示のみ
  const renderLeftAction = () => {
    return (
      <View style={styles.demoteAction}>
        <Text style={styles.demoteActionText}>子に</Text>
        <Text style={styles.demoteActionIcon}>↙️</Text>
      </View>
    );
  };

  // タスクアイテムのレンダリング
  const renderTaskItem = ({ item, drag, isActive, getIndex }) => {
    const index = getIndex();
    const canDemote = index > 0; // 最初のタスク以外は子タスク化可能

    return (
      <Swipeable
        onSwipeableOpen={(direction) => {
          if (direction === 'left' && canDemote) {
            demoteParentToChild(item.id);
          }
        }}
        renderLeftActions={canDemote ? renderLeftAction : null}
        enabled={!isDeleteMode && editingId !== item.id && canDemote}
        leftThreshold={40}
      >
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
              <DraggableFlatList
                data={item.children}
                onDragEnd={({ data }) => handleChildDragEnd(item.id, data)}
                keyExtractor={(child) => child.id}
                renderItem={({ item: child, drag: childDrag, isActive: isChildActive }) => (
                  <Swipeable
                    onSwipeableOpen={(direction) => {
                      if (direction === 'right') {
                        promoteChildToParent(child.id, item.id);
                      }
                    }}
                    renderRightActions={() => (
                      <View style={styles.promoteAction}>
                        <Text style={styles.promoteActionText}>親に</Text>
                        <Text style={styles.promoteActionIcon}>↗️</Text>
                      </View>
                    )}
                    enabled={!isDeleteMode && editingId !== child.id}
                    rightThreshold={40}
                  >
                    <View style={[
                      styles.childTaskContainer,
                      isChildActive && styles.childTaskContainerActive
                    ]}>
                      <View style={[
                        styles.childTaskItem,
                        isDeleteMode && styles.childTaskItemDeleteMode,
                        isChildActive && styles.childTaskItemActive
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

                        {/* 子タスクのドラッグハンドル */}
                        {!isDeleteMode && (
                          <TouchableOpacity
                            style={styles.childDragHandle}
                            onLongPress={childDrag}
                            delayLongPress={100}
                          >
                            <Text style={styles.childDragHandleText}>⋮⋮</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </Swipeable>
                )}
                activationDistance={10}
                dragItemOverflow={false}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" translucent={false} />
        <View style={styles.container}>
          {/* 削除モード表示 */}
          {isDeleteMode && (
            <View style={styles.deleteModeIndicator}>
              <Text style={styles.deleteModeText}>
                🗑️ 削除モード - 削除したい項目の「✕」をタップ
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
            scrollEnabled={!isDeleteMode}
          />

          {/* フッターエリア */}
          <View style={styles.footer}>
            {/* 追加ボタン */}
            {!isDeleteMode && (
              <TouchableOpacity
                style={styles.footerAddButton}
                onPress={addTask}
                activeOpacity={0.7}
              >
                <Text style={styles.footerAddButtonText}>+</Text>
              </TouchableOpacity>
            )}

            {/* 削除モード切り替えボタン */}
            <TouchableOpacity
              style={[
                styles.footerDeleteButton,
                isDeleteMode && styles.footerDeleteButtonActive
              ]}
              onPress={toggleDeleteMode}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.footerDeleteButtonText,
                isDeleteMode && styles.footerDeleteButtonTextActive
              ]}>
                {isDeleteMode ? '✓' : '🗑'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}