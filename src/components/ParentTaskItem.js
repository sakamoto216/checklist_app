import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import ChildTaskItem from './ChildTaskItem';

const ParentTaskItem = ({
    item,
    index,
    selectedParentId,
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
    onToggleParentSelection,
    onMoveChildToAnotherParent,
    renderDropZone,
    renderChildTask
}) => {
    return (
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
                        onPress={() => !isDragging && !editingId && onToggleTask(item.id)}
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
                                        onPress={() => onDeleteTask(item.id)}
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
                                    if (isDragging && !isChildDrag && draggedItem?.id !== item.id) {
                                        // 親アイテムを子アイテムとして移動
                                        onMoveParentToChild(draggedItem.id, item.id);
                                        onEndDrag();
                                    } else if (isDragging && isChildDrag && draggedItem?.parentId !== item.id) {
                                        // 子アイテムを別の親の子として移動
                                        onMoveChildToAnotherParent && onMoveChildToAnotherParent(draggedItem.id, draggedItem.parentId, item.id);
                                        onEndDrag();
                                    } else if (!isDragging && !editingId) {
                                        // チェックボックスの切り替え（従来の動作）
                                        onToggleTask(item.id);
                                    }
                                }}
                                onLongPress={() => {
                                    if (!isDragging && !editingId) {
                                        onStartDrag(item, false);
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
                    {isDragging && ((isChildDrag && draggedItem?.parentId !== item.id) || (!isChildDrag && draggedItem?.id !== item.id)) && (
                        <TouchableOpacity
                            style={styles.childDropZone}
                            onPress={() => {
                                if (isChildDrag) {
                                    // 子アイテムを別の親の子として移動
                                    onMoveChildToAnotherParent && onMoveChildToAnotherParent(draggedItem.id, draggedItem.parentId, item.id);
                                } else {
                                    // 親アイテムを子として移動
                                    onMoveParentToChild(draggedItem.id, item.id);
                                }
                                onEndDrag();
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.childDropZoneText}>
                                {isChildDrag ? '子移動' : '子に移動'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {editingId !== item.id && (
                        <>
                            <TouchableOpacity
                                style={[
                                    styles.childAddButtonInline,
                                    selectedParentId === item.id && styles.childAddButtonInlineSelected
                                ]}
                                onPress={() => !isDragging && !editingId && onToggleParentSelection(item.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.childAddButtonInlineText}>
                                    {selectedParentId === item.id ? '完了' : '子追加'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => !isDragging && !editingId && onStartEditing(item.id, item.text)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.editButtonText}>編集</Text>
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
                {item.children.map((child) => renderChildTask(child, item.id, item.children))}

                {/* 子アイテムの最後のドロップゾーン */}
                {isDragging && isChildDrag && draggedItem?.parentId === item.id && item.children.length > 0 && (
                    <View style={{ marginLeft: 20, marginTop: 5 }}>
                        <TouchableOpacity
                            style={[styles.dropZoneBetween, { marginLeft: 0, marginRight: 0 }]}
                            onPress={() => {
                                // 子アイテムを最後に移動
                                const draggedIndex = item.children.findIndex(c => c.id === draggedItem.id);
                                if (draggedIndex !== -1 && onMoveParentToChild) {
                                    onMoveParentToChild(item.id, draggedIndex, item.children.length - 1);
                                }
                                onEndDrag();
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dropZoneLabel}>最後に移動</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ParentTaskItem;