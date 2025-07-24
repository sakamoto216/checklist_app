import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';
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

  // スクロール制御用のref
  const flatListRef = useRef(null);

  // キーボード表示状態
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // キーボードイベントリスナー
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // 編集中のアイテムにスクロールする関数
  const scrollToEditingItem = (taskId, isChild = false, parentId = null) => {
    if (!flatListRef.current) return;

    // 少し遅延してスクロール（キーボードアニメーション完了後）
    setTimeout(() => {
      // プラットフォーム別のviewPosition設定
      const viewPosition = Platform.OS === 'android' ? 0.15 : 0.3; // Androidはより上の位置に

      if (isChild) {
        // 子タスクの場合、親タスクのインデックスを探す
        const parentIndex = tasks.findIndex(task => task.id === parentId);
        if (parentIndex !== -1) {
          flatListRef.current?.scrollToIndex({
            index: parentIndex,
            animated: true,
            viewPosition: viewPosition,
          });
        }
      } else {
        // 親タスクの場合
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          flatListRef.current?.scrollToIndex({
            index: taskIndex,
            animated: true,
            viewPosition: viewPosition,
          });
        }
      }
    }, Platform.OS === 'android' ? 400 : 300); // Androidは少し長めの遅延
  };

  // 新しいタスクを追加（空の編集状態で）
  const addTask = () => {
    const newTask = {
      id: Date.now().toString(),
      text: '',
      completed: false,
      children: [],
    };

    // 親タスクとして追加
    setTasks(currentTasks => {
      const newTasks = [...currentTasks, newTask];

      // 新しく追加されたタスクにスクロール
      setTimeout(() => {
        if (flatListRef.current) {
          const viewPosition = Platform.OS === 'android' ? 0.15 : 0.3; // Androidはより上の位置に
          flatListRef.current.scrollToIndex({
            index: newTasks.length - 1,
            animated: true,
            viewPosition: viewPosition,
          });
        }
      }, Platform.OS === 'android' ? 150 : 100); // Androidは少し長めの遅延

      return newTasks;
    });

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

    // 編集中のアイテムにスクロール
    scrollToEditingItem(taskId, isChild, parentId);
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

    // 親タスクにスクロール
    scrollToEditingItem(newChildTask.id, true, parentId);
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

  // ドラッグ開始時の処理
  const handleDragBegin = () => {
    // ドラッグ開始時に編集モードを解除
    if (editingId) {
      cancelEditing();
    }
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
    const updatedTasks = tasks.map(task => {
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

    // 子タスクを親タスクとして追加
    if (childTask) {
      setTasks([...updatedTasks, childTask]);
    } else {
      setTasks(updatedTasks);
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
          ? {
            ...task,
            children: [
              ...task.children,
              // 元の子タスクも含めて新しい親の子として追加
              { ...targetTask, children: [] }, // 対象タスク自体
              ...targetTask.children // 元の子タスクたち
            ]
          }
          : task
      );
    });
  };

  // 右スワイプアクション（親タスク化）
  const renderRightAction = (childId, parentId) => {
    return (
      <TouchableOpacity
        style={styles.promoteAction}
        onPress={() => promoteChildToParent(childId, parentId)}
        activeOpacity={0.7}
      >
        <Text style={styles.promoteActionIcon}>↗️</Text>
      </TouchableOpacity>
    );
  };

  // 左スワイプアクション（子タスク化）
  const renderLeftAction = (taskId) => {
    return (
      <TouchableOpacity
        style={styles.demoteAction}
        onPress={() => demoteParentToChild(taskId)}
        activeOpacity={0.7}
      >
        <Text style={styles.demoteActionIcon}>↙️</Text>
      </TouchableOpacity>
    );
  };

  // FlatListのscrollToIndexエラーハンドリング
  const handleScrollToIndexFailed = (info) => {
    console.log('ScrollToIndex failed:', info);
    // フォールバック: 最後のアイテムにスクロール
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // タスクアイテムのレンダリング
  const renderTaskItem = ({ item, drag, isActive, getIndex }) => {
    const index = getIndex ? getIndex() : 0; // getIndexがundefinedの場合のフォールバック
    const canDemote = index > 0; // 最初のタスク以外は子タスク化可能

    return (
      <Swipeable
        onSwipeableOpen={(direction) => {
          if (direction === 'left' && canDemote) {
            demoteParentToChild(item.id);
          }
        }}
        renderLeftActions={canDemote ? () => renderLeftAction(item.id) : null}
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
                  placeholder="タスク名を入力..."
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
                    {item.text || '未入力のタスク'}
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

          {/* 子タスク一覧 - isActiveに関係なく表示・非表示を制御しない */}
          {item.children && item.children.length > 0 && (
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
                    renderRightActions={() => renderRightAction(child.id, item.id)}
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
                              placeholder="子タスク名を入力..."
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
                                {child.text || '未入力の子タスク'}
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
                nestedScrollEnabled={false}
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
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40} // Androidの余白を増加
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
                    ? Math.max(90, keyboardHeight > 0 ? 40 : 90) // Androidはより多くの余白
                    : Math.max(70, keyboardHeight > 0 ? 20 : 70) // iOSは従来通り
                }
              ]}
              activationDistance={15} // ドラッグ開始の閾値を少し上げる
              dragItemOverflow={false} // 他のアイテムに重ならないように
              scrollEnabled={!isDeleteMode}
              showsVerticalScrollIndicator={false}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              getItemLayout={(data, index) => ({
                length: 60, // 推定アイテム高さ
                offset: 60 * index,
                index,
              })}
              // パフォーマンス向上のための追加設定
              removeClippedSubviews={false} // 子タスクの表示バグ防止
              maintainVisibleContentPosition={null} // レイアウト安定化
            />
          </KeyboardAvoidingView>

          {/* フラットフッターエリア */}
          <View style={styles.footer}>
            {/* 追加ボタン（左半分） */}
            <TouchableOpacity
              style={styles.footerAddButton}
              onPress={addTask}
              activeOpacity={0.8}
              disabled={isDeleteMode}
            >
              <Text style={styles.footerAddButtonText}>+</Text>
            </TouchableOpacity>

            {/* 削除モード切り替えボタン（右半分） */}
            <TouchableOpacity
              style={[
                styles.footerDeleteButton,
                isDeleteMode && styles.footerDeleteButtonActive
              ]}
              onPress={toggleDeleteMode}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.footerDeleteButtonText,
                isDeleteMode && styles.footerDeleteButtonTextActive
              ]}>
                🗑
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}