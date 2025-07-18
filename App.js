import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './src/styles/styles';
import ModeIndicators from './src/components/ModeIndicators';
import TaskInput from './src/components/TaskInput';

export default function App() {
  // 基本状態
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);

  // ドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isChildDrag, setIsChildDrag] = useState(false);
  const [dragParentId, setDragParentId] = useState(null);

  // 編集状態
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);

  // 新しいタスクを追加
  const addTask = () => {
    if (inputText.trim() !== '') {
      const newTask = {
        id: Date.now().toString(),
        text: inputText,
        completed: false,
        parentId: selectedParentId,
        children: [],
      };

      if (selectedParentId) {
        // 子タスクとして追加
        setTasks(currentTasks => currentTasks.map(task =>
          task.id === selectedParentId
            ? { ...task, children: [...task.children, newTask] }
            : task
        ));
      } else {
        // 親タスクとして追加
        setTasks(currentTasks => [...currentTasks, newTask]);
      }

      setInputText('');
    }
  };

  // 編集モードを開始
  const startEditing = (taskId, currentText, isChild = false, parentId = null) => {
    if (isDragging) return; // ドラッグ中は編集不可

    setEditingId(taskId);
    setEditingText(currentText);
    setIsEditingChild(isChild);
    setEditingParentId(parentId);
  };

  // 編集をキャンセル
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
    setIsEditingChild(false);
    setEditingParentId(null);
  };

  // 編集を保存
  const saveEdit = () => {
    if (editingText.trim() === '') {
      Alert.alert('エラー', 'アイテム名を入力してください。');
      return;
    }

    if (isEditingChild) {
      // 子タスクの編集
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
      // 親タスクの編集
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === editingId
          ? { ...task, text: editingText.trim() }
          : task
      ));
    }

    cancelEditing();
  };

  // 親選択モードの切り替え
  const toggleParentSelection = (parentId) => {
    setSelectedParentId(selectedParentId === parentId ? null : parentId);
  };

  // ドラッグ開始
  const startDrag = (item, isChild = false, parentId = null) => {
    setIsDragging(true);
    setDraggedItem(item);
    setIsChildDrag(isChild);
    setDragParentId(parentId);
  };

  // ドラッグ終了
  const endDrag = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setIsChildDrag(false);
    setDragParentId(null);
  };

  // 子アイテムを指定位置に移動
  const moveChildToPosition = (childId, oldParentId, targetIndex) => {
    setTasks(currentTasks => {
      let childToMove = null;

      // 子アイテムを見つけて取得
      const updatedTasks = currentTasks.map(task => {
        if (task.id === oldParentId) {
          const child = task.children.find(c => c.id === childId);
          if (child) {
            childToMove = { ...child, children: [] };
            return {
              ...task,
              children: task.children.filter(c => c.id !== childId)
            };
          }
        }
        return task;
      });

      // 子アイテムを指定位置に親アイテムとして挿入
      if (childToMove) {
        const newTasks = [...updatedTasks];
        newTasks.splice(targetIndex, 0, childToMove);
        return newTasks;
      }

      return currentTasks;
    });
  };

  // 親アイテムを別の親の子アイテムとして移動
  const moveParentToChild = (parentId, targetParentId) => {
    setTasks(currentTasks => {
      let parentToMove = null;

      // 移動する親アイテムを見つけて取得
      const parentItem = currentTasks.find(task => task.id === parentId);
      if (parentItem) {
        parentToMove = {
          ...parentItem,
          children: [] // 子アイテムは移動時に独立させる
        };
      }

      // 元の親アイテムを削除し、その子アイテムを親レベルに昇格
      let newTasks = currentTasks.filter(task => task.id !== parentId);
      if (parentItem && parentItem.children.length > 0) {
        // 元の子アイテムを親レベルに追加
        newTasks = [...newTasks, ...parentItem.children.map(child => ({ ...child, children: [] }))];
      }

      // 移動先の親アイテムに子として追加
      if (parentToMove) {
        newTasks = newTasks.map(task =>
          task.id === targetParentId
            ? { ...task, children: [...task.children, parentToMove] }
            : task
        );
      }

      return newTasks;
    });
  };

  // アイテムの順序を変更
  const reorderTasks = (fromIndex, toIndex) => {
    setTasks(currentTasks => {
      const newTasks = [...currentTasks];
      const [movedItem] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, movedItem);
      return newTasks;
    });
  };

  // タスクの完了状態を切り替え
  const toggleTask = (taskId, isChild = false, parentId = null) => {
    if (isChild) {
      // 子タスクの状態変更
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
      // 親タスクの状態変更
      setTasks(currentTasks => currentTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      ));
    }
  };

  // タスクを削除
  const deleteTask = (taskId, isChild = false, parentId = null) => {
    Alert.alert(
      '削除確認',
      'このアイテムを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            if (isChild) {
              // 子タスクの削除
              setTasks(currentTasks => currentTasks.map(task =>
                task.id === parentId
                  ? {
                    ...task,
                    children: task.children.filter(child => child.id !== taskId)
                  }
                  : task
              ));
            } else {
              // 親タスクの削除（子タスクも一緒に削除）
              setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
              // 削除された親が選択されていた場合、選択を解除
              if (selectedParentId === taskId) {
                setSelectedParentId(null);
              }
            }
          }
        }
      ]
    );
  };

  // ドロップゾーンの表示
  const renderDropZone = (index) => {
    if (!isDragging) return null;

    return (
      <TouchableOpacity
        key={`drop-${index}`}
        style={styles.dropZoneBetween}
        onPress={() => {
          if (isChildDrag) {
            // 子アイテムを指定位置に移動
            moveChildToPosition(draggedItem.id, dragParentId, index);
          } else {
            // 親アイテムの順序変更
            setTasks(currentTasks => {
              const fromIndex = currentTasks.findIndex(t => t.id === draggedItem.id);
              const newTasks = [...currentTasks];
              const [movedItem] = newTasks.splice(fromIndex, 1);
              newTasks.splice(index, 0, movedItem);
              return newTasks;
            });
          }
          endDrag();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.dropZoneLabel}>ここに移動</Text>
      </TouchableOpacity>
    );
  };

  // 子タスクの表示
  const renderChildTask = (child, parentId) => (
    <View key={child.id} style={styles.childTaskContainer}>
      <View
        style={[
          styles.childTaskItem,
          isDragging && draggedItem?.id === child.id && styles.draggedItem
        ]}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => !isDragging && !editingId && toggleTask(child.id, true, parentId)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, child.completed && styles.checkboxCompleted]}>
            <Text style={styles.checkboxText}>
              {child.completed ? '✓' : ''}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.taskTextContainer}>
          {editingId === child.id ? (
            // 編集モード
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editingText}
                onChangeText={setEditingText}
                onSubmitEditing={saveEdit}
                autoFocus
                selectTextOnFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveEdit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  onPress={cancelEditing}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelEditButtonText}>キャンセル</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // 通常表示モード
            <TouchableOpacity
              style={styles.taskTextTouchable}
              onPress={() => {
                if (isDragging && !isChildDrag && draggedItem?.id !== child.id) {
                  // 親アイテムを子アイテムとして移動
                  moveParentToChild(draggedItem.id, parentId);
                  endDrag();
                } else if (!isDragging && !editingId) {
                  // 編集モードを開始（一旦シングルタップで編集開始）
                  startEditing(child.id, child.text, true, parentId);
                }
              }}
              onLongPress={() => {
                if (!isDragging && !editingId) {
                  startDrag(child, true, parentId);
                }
              }}
              delayLongPress={500}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.taskText,
                child.completed && styles.taskTextCompleted
              ]}>
                {child.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {editingId !== child.id && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => !isDragging && !editingId && deleteTask(child.id, true, parentId)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>削除</Text>
          </TouchableOpacity>
        )}

        {isDragging && draggedItem?.id === child.id && (
          <View style={styles.dragIndicator}>
            <Text style={styles.dragIndicatorText}>📱</Text>
          </View>
        )}
      </View>
    </View>
  );

  // 親タスクの表示
  const renderTask = ({ item, index }) => (
    <View>
      {/* 上部のドロップゾーン */}
      {renderDropZone(index)}

      <View style={[
        styles.taskContainer,
        isDragging && draggedItem?.id === item.id && styles.draggedItem
      ]}>
        {/* 親タスク */}
        <View style={[
          styles.parentTaskItem,
          selectedParentId === item.id && styles.parentTaskItemSelected
        ]}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => !isDragging && !editingId && toggleTask(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
              <Text style={styles.checkboxText}>
                {item.completed ? '✓' : ''}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.taskTextContainer}>
            {editingId === item.id ? (
              // 編集モード
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                  onSubmitEditing={saveEdit}
                  autoFocus
                  selectTextOnFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveEdit}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.saveButtonText}>保存</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelEditButton}
                    onPress={cancelEditing}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelEditButtonText}>キャンセル</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // 通常表示モード
              <TouchableOpacity
                style={styles.taskTextTouchable}
                onPress={() => {
                  if (isDragging && !isChildDrag && draggedItem?.id !== item.id) {
                    // 親アイテムを子アイテムとして移動
                    moveParentToChild(draggedItem.id, item.id);
                    endDrag();
                  } else if (!isDragging && !editingId) {
                    // 編集モードを開始（一旦シングルタップで編集開始）
                    startEditing(item.id, item.text);
                  }
                }}
                onLongPress={() => {
                  if (!isDragging && !editingId) {
                    startDrag(item, false);
                  }
                }}
                delayLongPress={500}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.taskText,
                  item.completed && styles.taskTextCompleted
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 子に移動ドロップゾーン */}
          {isDragging && !isChildDrag && draggedItem?.id !== item.id && (
            <TouchableOpacity
              style={styles.childDropZone}
              onPress={() => {
                moveParentToChild(draggedItem.id, item.id);
                endDrag();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.childDropZoneText}>子に移動</Text>
            </TouchableOpacity>
          )}

          {editingId !== item.id && (
            <>
              <TouchableOpacity
                style={[
                  styles.childAddButtonInline,
                  selectedParentId === item.id && styles.childAddButtonInlineSelected
                ]}
                onPress={() => !isDragging && !editingId && toggleParentSelection(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.childAddButtonInlineText}>
                  {selectedParentId === item.id ? '追加完了' : '追加'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => !isDragging && !editingId && deleteTask(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </>
          )}

          {isDragging && draggedItem?.id === item.id && (
            <View style={styles.dragIndicator}>
              <Text style={styles.dragIndicatorText}>📱</Text>
            </View>
          )}
        </View>

        {/* 子タスク一覧 */}
        {item.children.map((child) => renderChildTask(child, item.id))}
      </View>
    </View>
  );

  // 統計情報の計算
  const getTotalStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    tasks.forEach(task => {
      totalTasks += 1;
      if (task.completed) {
        completedTasks += 1;
      }

      task.children.forEach(child => {
        totalTasks += 1;
        if (child.completed) {
          completedTasks += 1;
        }
      });
    });

    return { total: totalTasks, completed: completedTasks };
  };

  const stats = getTotalStats();

  // 選択された親の名前を取得
  const getSelectedParentName = () => {
    if (!selectedParentId) return '';
    const selectedParent = tasks.find(task => task.id === selectedParentId);
    return selectedParent ? selectedParent.text : '';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : .3}
    >
      <Text style={styles.title}>GearList</Text>

      <Text style={styles.counter}>
        ✅: {stats.completed} / {stats.total}
      </Text>

      <ModeIndicators
        selectedParentId={selectedParentId}
        selectedParentName={getSelectedParentName()}
        onCancelParentSelection={() => setSelectedParentId(null)}
        editingId={editingId}
        isDragging={isDragging}
        isChildDrag={isChildDrag}
        onCancelDrag={endDrag}
      />

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        ListFooterComponent={() => (
          isDragging ? (
            <TouchableOpacity
              style={styles.dropZoneFinal}
              onPress={() => {
                if (isChildDrag) {
                  // 子アイテムを最後に移動
                  moveChildToPosition(draggedItem.id, dragParentId, tasks.length);
                } else {
                  // 親アイテムを最後に移動
                  setTasks(currentTasks => {
                    const fromIndex = currentTasks.findIndex(t => t.id === draggedItem.id);
                    const newTasks = [...currentTasks];
                    const [movedItem] = newTasks.splice(fromIndex, 1);
                    newTasks.push(movedItem);
                    return newTasks;
                  });
                }
                endDrag();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.dropZoneLabel}>最後に移動</Text>
            </TouchableOpacity>
          ) : null
        )}
      />

      <TaskInput
        inputText={inputText}
        onChangeText={setInputText}
        onSubmit={addTask}
        placeholder={selectedParentId ? `「${getSelectedParentName()}」に新しいアイテムを入力...` : "新しいアイテムを入力..."}
        disabled={!!editingId}
      />
    </KeyboardAvoidingView>
  );
}