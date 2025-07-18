import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

const ChildTaskItem = ({
    child,
    parentId,
    parentChildren,
    isDragging,
    draggedItem,
    isChildDrag,
    editingId,
    editingText,
    onEditingTextChange,
    onToggleTask,
    onStartEditing,
    onSaveEdit,
    onCancelEditing,
    onStartDrag,
    onDeleteTask,
    onMoveParentToChild,
    onEndDrag,
    onReorderChildren
}) => {
    return (
        <View style={styles.childTaskContainer}>
            {/* 子アイテム上部のドロップゾーン（子アイテム同士の並び替え用） */}
            {isDragging && isChildDrag && draggedItem?.parentId === parentId && draggedItem?.id !== child.id && (
                <TouchableOpacity
                    style={[styles.dropZoneBetween, { marginLeft: 0, marginRight: 0 }]}
                    onPress={() => {
                        // 同じ親内での子アイテム並び替え
                        const draggedIndex = parentChildren.findIndex(c => c.id === draggedItem.id);
                        const targetIndex = parentChildren.findIndex(c => c.id === child.id);
                        onReorderChildren(parentId, draggedIndex, targetIndex);
                        onEndDrag();
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.dropZoneLabel}>ここに移動</Text>
                </TouchableOpacity>
            )}

            <View
                style={[
                    styles.childTaskItem,
                    isDragging && draggedItem?.id === child.id && styles.draggedItem
                ]}
            >
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => !isDragging && !editingId && onToggleTask(child.id, true, parentId)}
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
                                onChangeText={onEditingTextChange}
                                onSubmitEditing={onSaveEdit}
                                autoFocus
                                selectTextOnFocus
                            />
                            <View style={styles.editButtons}>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={onSaveEdit}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.saveButtonText}>保存</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelEditButton}
                                    onPress={onCancelEditing}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.cancelEditButtonText}>キャンセル</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => onDeleteTask(child.id, true, parentId)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.deleteButtonText}>削除</Text>
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
                                    onMoveParentToChild(draggedItem.id, parentId);
                                    onEndDrag();
                                } else if (!isDragging && !editingId) {
                                    // チェックボックスの切り替え（従来の動作）
                                    onToggleTask(child.id, true, parentId);
                                }
                            }}
                            onLongPress={() => {
                                if (!isDragging && !editingId) {
                                    // 子アイテムにparentIdを追加してドラッグ開始
                                    const childWithParent = { ...child, parentId: parentId };
                                    onStartDrag(childWithParent, true, parentId);
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
                        style={styles.editButton}
                        onPress={() => !isDragging && !editingId && onStartEditing(child.id, child.text, true, parentId)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.editButtonText}>編集</Text>
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
};

export default ChildTaskItem;