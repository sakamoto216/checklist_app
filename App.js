// 子アイテムを指定位置に移動
const moveChildToPosition = (childId, oldParentId, targetIndex) => {
  let childToMove = null;

  // 子アイテムを見つけて取得
  const updatedTasks = tasks.map(task => {
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
    setTasks(newTasks);
  }
}; import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);

  // ドラッグ状態の管理
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isChildDrag, setIsChildDrag] = useState(false);
  const [dragParentId, setDragParentId] = useState(null);

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
        setTasks(tasks.map(task =>
          task.id === selectedParentId
            ? { ...task, children: [...task.children, newTask] }
            : task
        ));
      } else {
        // 親タスクとして追加
        setTasks([...tasks, newTask]);
      }

      setInputText('');
    }
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

  // 親アイテムを別の親の子アイテムとして移動
  const moveParentToChild = (parentId, targetParentId) => {
    let parentToMove = null;

    // 移動する親アイテムを見つけて取得
    const parentItem = tasks.find(task => task.id === parentId);
    if (parentItem) {
      parentToMove = {
        ...parentItem,
        children: [] // 子アイテムは移動時に独立させる
      };
    }

    // 元の親アイテムを削除し、その子アイテムを親レベルに昇格
    let newTasks = tasks.filter(task => task.id !== parentId);
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

    setTasks(newTasks);
  };

  // アイテムの順序を変更
  const reorderTasks = (fromIndex, toIndex) => {
    const newTasks = [...tasks];
    const [movedItem] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedItem);
    setTasks(newTasks);
  };

  // タスクの完了状態を切り替え
  const toggleTask = (taskId, isChild = false, parentId = null) => {
    if (isChild) {
      // 子タスクの状態変更
      setTasks(tasks.map(task =>
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
      setTasks(tasks.map(task =>
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
              setTasks(tasks.map(task =>
                task.id === parentId
                  ? {
                    ...task,
                    children: task.children.filter(child => child.id !== taskId)
                  }
                  : task
              ));
            } else {
              // 親タスクの削除（子タスクも一緒に削除）
              setTasks(tasks.filter(task => task.id !== taskId));
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
            const fromIndex = tasks.findIndex(t => t.id === draggedItem.id);
            reorderTasks(fromIndex, index);
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
          onPress={() => !isDragging && toggleTask(child.id, true, parentId)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, child.completed && styles.checkboxCompleted]}>
            <Text style={styles.checkboxText}>
              {child.completed ? '✓' : ''}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskTextContainer}
          onPress={() => {
            if (isDragging && !isChildDrag && draggedItem?.id !== child.id) {
              // 親アイテムを子アイテムとして移動
              moveParentToChild(draggedItem.id, parentId);
              endDrag();
            } else if (!isDragging) {
              toggleTask(child.id, true, parentId);
            }
          }}
          onLongPress={() => {
            if (!isDragging) {
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

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => !isDragging && deleteTask(child.id, true, parentId)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>

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
            onPress={() => !isDragging && toggleTask(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
              <Text style={styles.checkboxText}>
                {item.completed ? '✓' : ''}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.taskTextContainer}
            onPress={() => {
              if (isDragging && !isChildDrag && draggedItem?.id !== item.id) {
                // 親アイテムを子アイテムとして移動
                moveParentToChild(draggedItem.id, item.id);
                endDrag();
              } else if (!isDragging) {
                toggleTask(item.id);
              }
            }}
            onLongPress={() => {
              if (!isDragging) {
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

          <TouchableOpacity
            style={[
              styles.childAddButtonInline,
              selectedParentId === item.id && styles.childAddButtonInlineSelected
            ]}
            onPress={() => !isDragging && toggleParentSelection(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.childAddButtonInlineText}>
              {selectedParentId === item.id ? '追加完了' : '追加'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => !isDragging && deleteTask(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>削除</Text>
          </TouchableOpacity>

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

      {selectedParentId && (
        <View style={styles.modeIndicator}>
          <Text style={styles.modeText}>
            アイテム追加モード: {getSelectedParentName()}
          </Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setSelectedParentId(null)}
          >
            <Text style={styles.cancelModeText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {isDragging && (
        <View style={styles.dragModeIndicator}>
          <Text style={styles.dragModeText}>
            {isChildDrag
              ? '子アイテムを移動中 - 点線エリアをタップして移動'
              : '親アイテムを移動中 - 点線エリア:順序変更 / 親アイテム:子に変更'
            }
          </Text>
          <TouchableOpacity
            style={styles.cancelDragButton}
            onPress={endDrag}
          >
            <Text style={styles.cancelDragText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      )}

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
                  const fromIndex = tasks.findIndex(t => t.id === draggedItem.id);
                  reorderTasks(fromIndex, tasks.length - 1);
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={selectedParentId ? `「${getSelectedParentName()}」に新しいアイテムを入力...` : "新しいアイテムを入力..."}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>
            追加
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modeIndicator: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  modeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#FF5722',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dragModeIndicator: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  dragModeText: {
    color: '#856404',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 12,
  },
  cancelDragButton: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  cancelDragText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 20,
  },
  taskContainer: {
    marginBottom: 15,
  },
  parentTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  parentTaskItemSelected: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  childTaskContainer: {
    marginLeft: 20,
    marginTop: 5,
  },
  childTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  checkboxContainer: {
    padding: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskTextContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  childAddButtonInline: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 32,
    height: 32,
  },
  childAddButtonInlineSelected: {
    backgroundColor: '#2196F3',
  },
  childAddButtonInlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  draggedItem: {
    opacity: 0.5,
    backgroundColor: '#e0e0e0',
  },
  dragIndicator: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  dragIndicatorText: {
    fontSize: 16,
  },
  dropZoneBetween: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  dropZoneFinal: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  dropLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#2196F3',
    borderRadius: 1,
    marginBottom: 4,
  },
  dropZoneLabel: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  counter: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
  },
});