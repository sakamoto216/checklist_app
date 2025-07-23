import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { styles } from './src/styles/styles';
import TaskInput from './src/components/TaskInput';

export default function App() {
  // 基本状態
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);

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
        children: [],
      };

      if (selectedParentId) {
        setTasks(currentTasks => currentTasks.map(task =>
          task.id === selectedParentId
            ? { ...task, children: [...task.children, newTask] }
            : task
        ));
      } else {
        setTasks(currentTasks => [...currentTasks, newTask]);
      }

      setInputText('');
    }
  };

  // 編集関連
  const startEditing = (taskId, currentText, isChild = false, parentId = null) => {
    setEditingId(taskId);
    setEditingText(currentText);
    setIsEditingChild(isChild);
    setEditingParentId(parentId);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
    setIsEditingChild(false);
    setEditingParentId(null);
  };

  const saveEdit = () => {
    if (editingText.trim() === '') {
      Alert.alert('エラー', 'アイテム名を入力してください。');
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
    setSelectedParentId(selectedParentId === parentId ? null : parentId);
  };

  const toggleTask = (taskId, isChild = false, parentId = null) => {
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
              if (selectedParentId === taskId) {
                setSelectedParentId(null);
              }
            }
            if (editingId === taskId) {
              cancelEditing();
            }
          }
        }
      ]
    );
  };

  // ドラッグ&ドロップの並び替えハンドラー
  const handleDragEnd = ({ data }) => {
    setTasks(data);
  };

  // タスクアイテムのレンダリング
  const renderTaskItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View style={[
          styles.taskContainer,
          isActive && styles.taskContainerActive
        ]}>
          {/* 親タスク */}
          <View style={[
            styles.parentTaskItem,
            selectedParentId === item.id && styles.parentTaskItemSelected
          ]}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => toggleTask(item.id)}
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
                  style={styles.taskTextTouchable}
                  onPress={() => startEditing(item.id, item.text)}
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

            {/* ボタン群 */}
            {editingId === item.id ? (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveEdit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelEditing}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    selectedParentId === item.id && styles.selectButtonSelected
                  ]}
                  onPress={() => toggleParentSelection(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.selectButtonText,
                    selectedParentId === item.id && styles.selectButtonTextSelected
                  ]}>
                    {selectedParentId === item.id ? '完了' : '子追加'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => startEditing(item.id, item.text)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>編集</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTask(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>削除</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ドラッグハンドル */}
            <TouchableOpacity
              style={styles.dragHandle}
              onLongPress={drag}
              delayLongPress={100}
            >
              <Text style={styles.dragHandleText}>⋮⋮</Text>
            </TouchableOpacity>
          </View>

          {/* 子タスク一覧 */}
          {item.children && item.children.length > 0 && !isActive && (
            <View style={styles.childrenContainer}>
              {item.children.map((child) => (
                <View key={child.id} style={styles.childTaskContainer}>
                  <View style={styles.childTaskItem}>
                    <TouchableOpacity
                      style={styles.checkboxContainerChild}
                      onPress={() => toggleTask(child.id, true, item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, styles.checkboxChild, child.completed && styles.checkboxCompleted]}>
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
                          style={[styles.taskTextTouchable, styles.taskTextTouchableChild]}
                          onPress={() => startEditing(child.id, child.text, true, item.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.taskText,
                            styles.taskTextChild,
                            child.completed && styles.taskTextCompleted
                          ]}>
                            {child.text}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[styles.deleteButton, styles.deleteButtonChild]}
                      onPress={() => deleteTask(child.id, true, item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.deleteButtonText, styles.deleteButtonTextChild]}>削除</Text>
                    </TouchableOpacity>
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>持ち物チェックリスト</Text>

        {/* 使用方法の説明 */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            💡 右側の「⋮⋮」を長押しして並び替え
          </Text>
        </View>

        <TaskInput
          inputText={inputText}
          onChangeText={setInputText}
          onSubmit={addTask}
          placeholder={
            selectedParentId
              ? "子アイテムを入力してください"
              : "新しいアイテムを入力してください"
          }
        />

        {selectedParentId && (
          <View style={styles.selectedParentInfo}>
            <Text style={styles.selectedParentText}>
              選択中: {tasks.find(t => t.id === selectedParentId)?.text}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedParentId(null)}
              style={styles.clearSelectionButton}
            >
              <Text style={styles.clearSelectionText}>選択解除</Text>
            </TouchableOpacity>
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
        />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}