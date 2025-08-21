import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { styles } from '../styles/styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

const TaskItem = ({
    item,
    drag,
    isActive,
    getIndex,
    isDeleteMode,
    editingId,
    editingText,
    setEditingText,
    onStartEditing,
    onSaveEdit,
    onCancelEditing,
    onToggleTask,
    onDeleteTask,
    onAddChildTask,
    onDemoteTask,
    onPromoteTask,
    onChildDragEnd,
    onDragEnd, // 新しく追加
    level = 0, // 0: 親, 1: 子, 2: 孫
    parentId = null,
    grandparentId = null,
    hideEditingTask = false, // フローティング中は編集中タスクを非表示
    dragSensitivity = 100,
    showTaskNumbers = false,
    showCompletedTasks = true,
    swipeSensitivity = 40,
}) => {
    // ドラッグ状態を管理
    const [isDragging, setIsDragging] = useState(false);
    const [childDragging, setChildDragging] = useState(false);
    const [grandchildDragging, setGrandchildDragging] = useState(false);

    // ドラッグ終了時に状態をリセット
    React.useEffect(() => {
        if (!isActive) {
            setIsDragging(false);
        }
    }, [isActive]);
    const index = getIndex ? getIndex() : 0;
    const canDemote = index > 0 && level < 2; // 孫レベルは降格不可
    const canPromote = level > 0; // 親レベルは昇格不可
    const canAddChild = level < 2; // 孫レベルは子を持てない

    // 右スワイプアクション（昇格）
    const renderRightAction = (taskId, currentLevel, parentId, grandparentId) => {
        return (
            <TouchableOpacity
                style={styles.promoteAction}
                onPress={() => onPromoteTask(taskId, currentLevel, parentId, grandparentId)}
                activeOpacity={0.7}
            >
                <AntDesign style={styles.promoteActionIcon} name="indent-left" />
            </TouchableOpacity>
        );
    };

    // 左スワイプアクション（降格）
    const renderLeftAction = (taskId, currentLevel) => {
        return (
            <TouchableOpacity
                style={styles.demoteAction}
                onPress={() => onDemoteTask(taskId, currentLevel)}
                activeOpacity={0.7}
            >
                <AntDesign style={styles.demoteActionIcon} name="indent-right" />
            </TouchableOpacity>
        );
    };

    // 子タスクのレンダリング（再帰的）
    const renderChildTask = ({ item: child, drag: childDrag, isActive: isChildActive, getIndex: getChildIndex }) => {
        const childLevel = level + 1;
        const childParentId = level === 0 ? item.id : parentId;
        const childGrandparentId = level === 0 ? null : (level === 1 ? item.id : grandparentId);
        const childIndex = getChildIndex ? getChildIndex() : 0;

        // スワイプ可能条件
        const canPromote = childLevel > 0; // 子・孫は昇格可能
        const canDemote = childLevel === 1 && childIndex > 0; // 子の場合、先頭以外は降格可能

        return (
            <Swipeable
                onSwipeableOpen={(direction) => {
                    if (direction === 'right' && canPromote) {
                        onPromoteTask(child.id, childLevel, childParentId, childGrandparentId);
                    } else if (direction === 'left' && canDemote) {
                        onDemoteTask(child.id, childLevel, childParentId, childGrandparentId);
                    }
                }}
                renderRightActions={canPromote ? () => renderRightAction(child.id, childLevel, childParentId, childGrandparentId) : null}
                renderLeftActions={canDemote ? () => renderLeftAction(child.id, childLevel) : null}
                enabled={!isDeleteMode && editingId !== child.id && !isDragging && !childDragging && !grandchildDragging}
                rightThreshold={swipeSensitivity}
                leftThreshold={swipeSensitivity}
            >
                <View style={[
                    level === 0 ? styles.childTaskContainer : styles.grandchildTaskContainer,
                    isChildActive && styles.childTaskContainerActive
                ]}>
                    <View style={[
                        level === 0 ? styles.childTaskItem : styles.grandchildTaskItem,
                        isDeleteMode && (level === 0 ? styles.childTaskItemDeleteMode : styles.grandchildTaskItemDeleteMode),
                        isChildActive && (level === 0 ? styles.childTaskItemActive : styles.grandchildTaskItemActive)
                    ]}>
                        {/* 削除ボタン */}
                        {isDeleteMode && (
                            <TouchableOpacity
                                style={level === 0 ? styles.deleteModeButtonChild : styles.deleteModeButtonGrandchild}
                                onPress={() => onDeleteTask(child.id, childLevel, childParentId, childGrandparentId)}
                                activeOpacity={0.7}
                            >
                                <Text style={level === 0 ? styles.deleteModeButtonTextChild : styles.deleteModeButtonTextGrandchild}>✕</Text>
                            </TouchableOpacity>
                        )}

                        {/* チェックボックス */}
                        <TouchableOpacity
                            style={[
                                styles.checkboxContainerChild,
                                isDeleteMode && styles.checkboxContainerDisabled
                            ]}
                            onPress={() => onToggleTask(child.id, childLevel, childParentId, childGrandparentId)}
                            activeOpacity={isDeleteMode ? 1 : 0.7}
                            disabled={isDeleteMode}
                        >
                            <View style={[
                                styles.checkbox,
                                level === 0 ? styles.checkboxChild : styles.checkboxGrandchild,
                                child.completed && styles.checkboxCompleted,
                                isDeleteMode && styles.checkboxDisabled
                            ]}>
                                <Text style={[
                                    styles.checkboxText,
                                    level === 0 ? styles.checkboxTextChild : styles.checkboxTextGrandchild
                                ]}>
                                    {child.completed ? '✓' : ''}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* テキスト入力/表示エリア */}
                        <View style={[
                            styles.taskTextContainer,
                            level === 0 ? styles.taskTextContainerChild : styles.taskTextContainerGrandchild
                        ]}>
                            {editingId === child.id && !hideEditingTask ? (
                                <TextInput
                                    style={[
                                        styles.editInput,
                                        level === 0 ? styles.editInputChild : styles.editInputGrandchild
                                    ]}
                                    value={editingText}
                                    onChangeText={setEditingText}
                                    onSubmitEditing={onSaveEdit}
                                    onBlur={onCancelEditing}
                                    autoFocus
                                    placeholder={level === 0 ? "子タスク名を入力..." : "孫タスク名を入力..."}
                                />
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        styles.taskTextTouchable,
                                        level === 0 ? styles.taskTextTouchableChild : styles.taskTextTouchableGrandchild,
                                        isDeleteMode && styles.taskTextTouchableDisabled,
                                        editingId === child.id && hideEditingTask && { opacity: 0.3 }, // 編集中は半透明
                                    ]}
                                    onPress={() => onStartEditing(child.id, child.text, childLevel, childParentId, childGrandparentId)}
                                    activeOpacity={isDeleteMode ? 1 : 0.7}
                                    disabled={isDeleteMode}
                                >
                                    <Text style={[
                                        styles.taskText,
                                        level === 0 ? styles.taskTextChild : styles.taskTextGrandchild,
                                        child.completed && styles.taskTextCompleted,
                                        isDeleteMode && styles.taskTextDisabled
                                    ]}>
                                        {child.text || (level === 0 ? '未入力の子タスク' : '未入力の孫タスク')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* 子タスク追加ボタン（子レベルでのみ孫追加） */}
                        {!isDeleteMode && editingId !== child.id && level === 0 && child.children !== undefined && (
                            <View style={styles.editActions}>
                                <TouchableOpacity
                                    style={styles.selectButton}
                                    onPress={() => onAddChildTask(child.id, 2, item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.selectButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ドラッグハンドル */}
                        {!isDeleteMode && (
                            <TouchableOpacity
                                style={level === 0 ? styles.childDragHandle : styles.grandchildDragHandle}
                                onLongPress={() => {
                                    setChildDragging(true);
                                    childDrag();
                                }}
                                delayLongPress={Platform.OS === 'android' ? Math.max(dragSensitivity, 120) : dragSensitivity}
                                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                                pressRetentionOffset={{ top: 30, bottom: 30, left: 30, right: 30 }}
                                activeOpacity={0.5}
                            >
                                <Entypo style={level === 0 ? styles.childDragHandleText : styles.grandchildDragHandleText} name="dots-three-vertical" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 孫タスク一覧（子レベルの場合のみ） */}
                    {level === 0 && child.children && child.children.length > 0 && (
                        <View style={styles.grandchildrenContainer}>
                            <DraggableFlatList
                                data={child.children}
                                onDragEnd={({ data }) => {
                                    setGrandchildDragging(false);
                                    onChildDragEnd(child.id, data, 2, item.id);
                                }}
                                keyExtractor={(grandchild) => grandchild.id}
                                renderItem={({ item: grandchild, drag: grandchildDrag, isActive: isGrandchildActive, getIndex: getGrandchildIndex }) => {
                                    const grandchildIndex = getGrandchildIndex ? getGrandchildIndex() : 0;

                                    return (
                                        <Swipeable
                                            onSwipeableOpen={(direction) => {
                                                if (direction === 'right') {
                                                    onPromoteTask(grandchild.id, 2, child.id, item.id);
                                                }
                                            }}
                                            renderRightActions={() => renderRightAction(grandchild.id, 2, child.id, item.id)}
                                            enabled={!isDeleteMode && editingId !== grandchild.id && !isDragging && !childDragging && !grandchildDragging}
                                            rightThreshold={swipeSensitivity}
                                        >
                                            <View style={[
                                                styles.grandchildTaskContainer,
                                                isGrandchildActive && styles.childTaskContainerActive
                                            ]}>
                                                <View style={[
                                                    styles.grandchildTaskItem,
                                                    isDeleteMode && styles.grandchildTaskItemDeleteMode,
                                                    isGrandchildActive && styles.grandchildTaskItemActive
                                                ]}>
                                                    {/* 孫タスクの削除ボタン */}
                                                    {isDeleteMode && (
                                                        <TouchableOpacity
                                                            style={styles.deleteModeButtonGrandchild}
                                                            onPress={() => onDeleteTask(grandchild.id, 2, child.id, item.id)}
                                                            activeOpacity={0.7}
                                                        >
                                                            <Text style={styles.deleteModeButtonTextGrandchild}>✕</Text>
                                                        </TouchableOpacity>
                                                    )}

                                                    {/* チェックボックス */}
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.checkboxContainerChild,
                                                            isDeleteMode && styles.checkboxContainerDisabled
                                                        ]}
                                                        onPress={() => onToggleTask(grandchild.id, 2, child.id, item.id)}
                                                        activeOpacity={isDeleteMode ? 1 : 0.7}
                                                        disabled={isDeleteMode}
                                                    >
                                                        <View style={[
                                                            styles.checkbox,
                                                            styles.checkboxGrandchild,
                                                            grandchild.completed && styles.checkboxCompleted,
                                                            isDeleteMode && styles.checkboxDisabled
                                                        ]}>
                                                            <Text style={[
                                                                styles.checkboxText,
                                                                styles.checkboxTextGrandchild
                                                            ]}>
                                                                {grandchild.completed ? '✓' : ''}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    {/* テキスト入力/表示エリア */}
                                                    <View style={styles.taskTextContainerGrandchild}>
                                                        {editingId === grandchild.id && !hideEditingTask ? (
                                                            <TextInput
                                                                style={styles.editInputGrandchild}
                                                                value={editingText}
                                                                onChangeText={setEditingText}
                                                                onSubmitEditing={onSaveEdit}
                                                                onBlur={onCancelEditing}
                                                                autoFocus
                                                                placeholder="孫タスク名を入力..."
                                                            />
                                                        ) : (
                                                            <TouchableOpacity
                                                                style={[
                                                                    styles.taskTextTouchableGrandchild,
                                                                    isDeleteMode && styles.taskTextTouchableDisabled,
                                                                    editingId === grandchild.id && hideEditingTask && { opacity: 0.3 }, // 編集中は半透明
                                                                ]}
                                                                onPress={() => onStartEditing(grandchild.id, grandchild.text, 2, child.id, item.id)}
                                                                activeOpacity={isDeleteMode ? 1 : 0.7}
                                                                disabled={isDeleteMode}
                                                            >
                                                                <Text style={[
                                                                    styles.taskTextGrandchild,
                                                                    grandchild.completed && styles.taskTextCompleted,
                                                                    isDeleteMode && styles.taskTextDisabled
                                                                ]}>
                                                                    {grandchild.text || '未入力の孫タスク'}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>

                                                    {/* ドラッグハンドル */}
                                                    {!isDeleteMode && (
                                                        <TouchableOpacity
                                                            style={styles.grandchildDragHandle}
                                                            onLongPress={() => {
                                                                setGrandchildDragging(true);
                                                                grandchildDrag();
                                                            }}
                                                            delayLongPress={Platform.OS === 'android' ? Math.max(dragSensitivity, 120) : dragSensitivity}
                                                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                                                            pressRetentionOffset={{ top: 30, bottom: 30, left: 30, right: 30 }}
                                                            activeOpacity={0.5}
                                                        >
                                                            <Entypo style={styles.grandchildDragHandleText} name="dots-three-vertical" />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </Swipeable>
                                    );
                                }}
                                activationDistance={Platform.OS === 'android' ? 20 : 15} // Android用安定性向上
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
        <Swipeable
            onSwipeableOpen={(direction) => {
                if (direction === 'left' && level === 0 && canDemote) {
                    onDemoteTask(item.id, level, parentId, grandparentId);
                }
            }}
            renderLeftActions={level === 0 && canDemote ? () => renderLeftAction(item.id, level) : null}
            enabled={!isDeleteMode && editingId !== item.id && !isDragging && !childDragging && !grandchildDragging}
            leftThreshold={40} // 20→40に変更して感度を下げる
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
                            onPress={() => onDeleteTask(item.id, level, parentId, grandparentId)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.deleteModeButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}

                    {/* チェックボックス */}
                    <TouchableOpacity
                        style={[
                            styles.checkboxContainer,
                            isDeleteMode && styles.checkboxContainerDisabled
                        ]}
                        onPress={() => onToggleTask(item.id, level, parentId, grandparentId)}
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

                    {/* テキスト入力/表示エリア */}
                    <View style={styles.taskTextContainer}>
                        {editingId === item.id && !hideEditingTask ? (
                            <TextInput
                                style={styles.editInput}
                                value={editingText}
                                onChangeText={setEditingText}
                                onSubmitEditing={onSaveEdit}
                                onBlur={onCancelEditing}
                                autoFocus
                                placeholder="タスク名を入力..."
                            />
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles.taskTextTouchable,
                                    isDeleteMode && styles.taskTextTouchableDisabled,
                                    editingId === item.id && hideEditingTask && { opacity: 0.3 }, // 編集中は半透明
                                ]}
                                onPress={() => onStartEditing(item.id, item.text, level, parentId, grandparentId)}
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

                    {/* 子タスク追加ボタン（親レベルのみ） */}
                    {!isDeleteMode && editingId !== item.id && level === 0 && (
                        <View style={styles.editActions}>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => onAddChildTask(item.id, level + 1, parentId)}
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
                            onLongPress={() => {
                                setIsDragging(true);
                                drag();
                            }}
                            delayLongPress={Platform.OS === 'android' ? Math.max(dragSensitivity, 100) : dragSensitivity}
                            hitSlop={{ 
                                top: Platform.OS === 'android' ? 25 : 15, 
                                bottom: Platform.OS === 'android' ? 25 : 15, 
                                left: Platform.OS === 'android' ? 25 : 15, 
                                right: Platform.OS === 'android' ? 25 : 15 
                            }}
                            pressRetentionOffset={{ 
                                top: Platform.OS === 'android' ? 50 : 30, 
                                bottom: Platform.OS === 'android' ? 50 : 30, 
                                left: Platform.OS === 'android' ? 50 : 30, 
                                right: Platform.OS === 'android' ? 50 : 30 
                            }}
                            activeOpacity={Platform.OS === 'android' ? 0.7 : 0.5}
                        >
                            <Entypo style={styles.dragHandleText} name="dots-three-vertical" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* 子タスク一覧 */}
                {item.children && item.children.length > 0 && (
                    <View style={styles.childrenContainer}>
                        <DraggableFlatList
                            data={item.children}
                            onDragEnd={({ data }) => {
                                setChildDragging(false);
                                onChildDragEnd(item.id, data, level + 1, parentId);
                            }}
                            keyExtractor={(child) => child.id}
                            renderItem={renderChildTask}
                            activationDistance={Platform.OS === 'android' ? 20 : 15} // Android用安定性向上
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

export default TaskItem;