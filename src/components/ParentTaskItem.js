import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

const ParentTaskItem = ({
    item,
    index,
    selectedParentId,
    isDragging,
    editingId,
    editingText,
    onEditingTextChange,
    onToggleTask,
    onStartEditing,
    onSaveEdit,
    onCancelEditing,
    onDeleteTask,
    onToggleParentSelection,
    renderChildTask
}) => {
    return (
        <View style={[
            styles.taskContainer,
            isDragging && styles.draggedItem
        ]}>
            {/* 親タスク */}
            <View style={[
                styles.parentTaskItem,
                selectedParentId === item.id && styles.parentTaskItemSelected
            ]}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => onToggleTask(item.id)}
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
                            onChangeText={onEditingTextChange}
                            onSubmitEditing={onSaveEdit}
                            onBlur={onCancelEditing}
                            autoFocus
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.taskTextTouchable}
                            onPress={() => onStartEditing(item.id, item.text)}
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

                {editingId === item.id ? (
                    <View style={styles.editActions}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={onSaveEdit}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.saveButtonText}>保存</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancelEditing}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            style={[
                                styles.selectButton,
                                selectedParentId === item.id && styles.selectButtonSelected
                            ]}
                            onPress={() => onToggleParentSelection(item.id)}
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
                            onPress={() => onStartEditing(item.id, item.text)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.editButtonText}>編集</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDeleteTask(item.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.deleteButtonText}>削除</Text>
                        </TouchableOpacity>
                    </>
                )}

                {isDragging && (
                    <View style={styles.dragIndicator}>
                        <Text style={styles.dragIndicatorText}>📱</Text>
                    </View>
                )}
            </View>

            {/* 子タスク一覧 */}
            {item.children && item.children.length > 0 && (
                <View style={styles.childrenContainer}>
                    {item.children.map((child) => renderChildTask(child, item.id))}
                </View>
            )}
        </View>
    );
};

export default ParentTaskItem;