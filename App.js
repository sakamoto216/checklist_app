import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './src/styles/styles';
import TaskInput from './src/components/TaskInput';
import DropZone from './src/components/DropZone';
import ChildTaskItem from './src/components/ChildTaskItem';
import ParentTaskItem from './src/components/ParentTaskItem';
import DraggableParentTaskItem from './src/components/DraggableParentTaskItem';

export default function App() {
  // 基本状態
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);

  // 新しいドラッグ&ドロップ状態
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(-1);
  const [dropTargetIndex, setDropTargetIndex] = useState(-1);

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
    // if (isDragging) return; // ドラッグ中は編集不可 → 一時的に無効化

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

  // 新しいドラッグ&ドロップ機能
  const handleDragStart = (taskId, taskIndex) => {
    setDraggedTaskId(taskId);
    setDraggedTaskIndex(taskIndex);
  };

  const handleDragEnd = () => {
    if (draggedTaskIndex !== -1 && dropTargetIndex !== -1 && draggedTaskIndex !== dropTargetIndex) {
      // 配列の並び替えを実行
      setTasks(currentTasks => {
        const newTasks = [...currentTasks];
        const [movedTask] = newTasks.splice(draggedTaskIndex, 1);
        newTasks.splice(dropTargetIndex, 0, movedTask);
        return newTasks;
      });
    }

    // 状態をリセット
    setDraggedTaskId(null);
    setDraggedTaskIndex(-1);
    setDropTargetIndex(-1);
  };

  const handleDragOver = (targetIndex) => {
    setDropTargetIndex(targetIndex);
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

  // 子アイテム同士の並び替え（同じ親内）
  const reorderChildrenInParent = (parentId, fromIndex, toIndex) => {
    setTasks(currentTasks => currentTasks.map(task => {
      if (task.id === parentId) {
        const newChildren = [...task.children];
        const [movedChild] = newChildren.splice(fromIndex, 1);
        newChildren.splice(toIndex, 0, movedChild);
        return {
          ...task,
          children: newChildren
        };
      }
      return task;
    }));
  };

  // 子アイテムを別の親の子として移動
  const moveChildToAnotherParent = (childId, oldParentId, newParentId) => {
    setTasks(currentTasks => {
      let childToMove = null;

      // 子アイテムを元の親から取得・削除
      const updatedTasks = currentTasks.map(task => {
        if (task.id === oldParentId) {
          const child = task.children.find(c => c.id === childId);
          if (child) {
            childToMove = { ...child };
            return {
              ...task,
              children: task.children.filter(c => c.id !== childId)
            };
          }
        }
        return task;
      });

      // 新しい親に子アイテムを追加
      if (childToMove) {
        return updatedTasks.map(task =>
          task.id === newParentId
            ? { ...task, children: [...task.children, childToMove] }
            : task
        );
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

    // 編集モードを終了
    if (editingId === taskId) {
      cancelEditing();
    }
  };

  // ドロップゾーンの表示（一時的に無効化）
  const renderDropZone = (index) => {
    return null; // ドロップゾーンを無効化
  };

  // 子タスクの表示
  const renderChildTask = (child, parentId, parentChildren) => (
    <ChildTaskItem
      key={child.id}
      child={child}
      parentId={parentId}
      parentChildren={parentChildren}
      isDragging={false} // 一時的に固定値
      draggedItem={null} // 一時的に固定値
      isChildDrag={false} // 一時的に固定値
      editingId={editingId}
      editingText={editingText}
      onEditingTextChange={setEditingText}
      onToggleTask={toggleTask}
      onStartEditing={startEditing}
      onSaveEdit={saveEdit}
      onCancelEditing={cancelEditing}
      onStartDrag={() => { }} // 一時的に空関数
      onDeleteTask={deleteTask}
      onMoveParentToChild={moveParentToChild}
      onEndDrag={() => { }} // 一時的に空関数
      onReorderChildren={reorderChildrenInParent}
      onMoveChildToAnotherParent={moveChildToAnotherParent}
    />
  );

  // 親タスクの表示（ドラッグ対応）
  const renderTask = ({ item, index }) => (
    <DraggableParentTaskItem
      item={item}
      index={index}
      selectedParentId={selectedParentId}
      isDragging={draggedTaskId === item.id}
      isDropTarget={dropTargetIndex === index}
      draggedItem={null}
      isChildDrag={false}
      editingId={editingId}
      editingText={editingText}
      onEditingTextChange={setEditingText}
      onToggleTask={toggleTask}
      onStartEditing={startEditing}
      onSaveEdit={saveEdit}
      onCancelEditing={cancelEditing}
      onStartDrag={() => { }}
      onDeleteTask={deleteTask}
      onMoveParentToChild={moveParentToChild}
      onEndDrag={() => { }}
      onToggleParentSelection={toggleParentSelection}
      onMoveChildToAnotherParent={moveChildToAnotherParent}
      renderDropZone={renderDropZone}
      renderChildTask={renderChildTask}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    />
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

  // 編集中のアイテム名を取得
  const getEditingItemName = () => {
    if (!editingId) return '';

    // 親アイテムから検索
    for (const task of tasks) {
      if (task.id === editingId) {
        return task.text;
      }
      // 子アイテムから検索
      for (const child of task.children) {
        if (child.id === editingId) {
          return child.text;
        }
      }
    }
    return '';
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : .3}
      >
        <Text style={styles.title}>GearList</Text>

        <Text style={styles.counter}>
          ✅: {stats.completed} / {stats.total}
        </Text>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
        />

        <TaskInput
          inputText={inputText}
          onChangeText={setInputText}
          onSubmit={addTask}
          placeholder={selectedParentId ? `「${getSelectedParentName()}」に新しいアイテムを入力...` : "新しいアイテムを入力..."}
          disabled={!!editingId}
        />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}