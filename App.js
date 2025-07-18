import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './src/styles/styles';
import ModeIndicators from './src/components/ModeIndicators';
import TaskInput from './src/components/TaskInput';
import DropZone from './src/components/DropZone';
import ChildTaskItem from './src/components/ChildTaskItem';
import ParentTaskItem from './src/components/ParentTaskItem';

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

  // ドロップゾーンの表示
  const renderDropZone = (index) => {
    const handleDrop = () => {
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
    };

    return (
      <DropZone
        isDragging={isDragging}
        index={index}
        onDrop={handleDrop}
        type="between"
      />
    );
  };

  // 子タスクの表示
  const renderChildTask = (child, parentId, parentChildren) => (
    <ChildTaskItem
      key={child.id}
      child={child}
      parentId={parentId}
      parentChildren={parentChildren}
      isDragging={isDragging}
      draggedItem={draggedItem}
      isChildDrag={isChildDrag}
      editingId={editingId}
      editingText={editingText}
      onEditingTextChange={setEditingText}
      onToggleTask={toggleTask}
      onStartEditing={startEditing}
      onSaveEdit={saveEdit}
      onCancelEditing={cancelEditing}
      onStartDrag={startDrag}
      onDeleteTask={deleteTask}
      onMoveParentToChild={moveParentToChild}
      onEndDrag={endDrag}
      onReorderChildren={reorderChildrenInParent}
      onMoveChildToAnotherParent={moveChildToAnotherParent}
    />
  );

  // 親タスクの表示
  const renderTask = ({ item, index }) => (
    <ParentTaskItem
      item={item}
      index={index}
      selectedParentId={selectedParentId}
      isDragging={isDragging}
      draggedItem={draggedItem}
      isChildDrag={isChildDrag}
      editingId={editingId}
      editingText={editingText}
      onEditingTextChange={setEditingText}
      onToggleTask={toggleTask}
      onStartEditing={startEditing}
      onSaveEdit={saveEdit}
      onCancelEditing={cancelEditing}
      onStartDrag={startDrag}
      onDeleteTask={deleteTask}
      onMoveParentToChild={moveParentToChild}
      onEndDrag={endDrag}
      onToggleParentSelection={toggleParentSelection}
      onMoveChildToAnotherParent={moveChildToAnotherParent}
      renderDropZone={renderDropZone}
      renderChildTask={renderChildTask}
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
        editingText={editingText}
        tasks={tasks}
        onCancelEditing={cancelEditing}
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
        ListFooterComponent={() => {
          const handleFinalDrop = () => {
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
          };

          return (
            <DropZone
              isDragging={isDragging}
              onDrop={handleFinalDrop}
              type="final"
            />
          );
        }}
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