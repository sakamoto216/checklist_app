import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
    level = 0, // 0: 親, 1: 子, 2: 孫
    parentId = null,
    grandparentId = null,
}) => {
    const index = getIndex ? getIndex() : 0;
    const canDemote = index > 0 && level < 2; // 孫レベルは降格不可
    const canPromote = level > 0; // 親レベルは昇格不可
    const canAddChild = level < 2; // 孫レベルは子を持てない（実際には孫は+ボタンを表示しない）

    // 右スワイプアクション（昇格）
    const renderRightAction = (taskId, currentLevel, parentId, grandparentId) => {
        if (!canPromote) return null;

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
        if (!canDemote) return null;

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
    const renderChildTask = ({ item: child, drag: childDrag, isActive: isChildActive }) => {
        const childLevel = level + 1;
        const childParentId = level === 0 ? item.id : parentId;
        const childGrandparentId = level === 0 ? null : (level === 1 ? item.id : grandparentId);

        return (
            <Swipeable
                onSwipeableOpen={(direction) => {
                    if (direction === 'right' && childLevel > 0) {
                        onPromoteTask(child.id, childLevel, childParentId, childGrandparentId);
                    }
                }}
                renderRightActions={() => renderRightAction(child.id, childLevel, childParentId, childGrandparentId)}
                enabled={!isDeleteMode && editingId !== child.id}
                rightThreshold={40}
            >
                <View style={[
                    level === 0 ? styles.childTaskContainer : styles.grandchildTaskContainer,
                    isChildActive && styles.childTaskContainerActive
                ]}>
                    <View style={[
                        level === 0 ? styles.childTaskItem : styles.grandchildTaskItem,
                        isDeleteMode && styles.childTaskItemDeleteMode,
                        isChildActive && styles.childTaskItemActive
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
                            {editingId === child.id ? (
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
                                        isDeleteMode && styles.taskTextTouchableDisabled
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

                        {/* 子タスク追加ボタン（子レベルでのみ孫追加、親タスクと同じデザイン） */}
                        {!isDeleteMode && editingId !== child.id && level === 0 && child.children !== undefined && (
                            <View style={styles.editActions}>
                                <TouchableOpacity
                                    style={styles.selectButton}
                                    onPress={() => onAddChildTask(child.id, 2, item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Entypo style={styles.selectButtonText} name="add-to-list" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ドラッグハンドル */}
                        {!isDeleteMode && (
                            <TouchableOpacity
                                style={level === 0 ? styles.childDragHandle : styles.grandchildDragHandle}
                                onLongPress={childDrag}
                                delayLongPress={100}
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
                                onDragEnd={({ data }) => onChildDragEnd(child.id, data, 2, item.id)}
                                keyExtractor={(grandchild) => grandchild.id}
                                renderItem={(props) => renderChildTask({ ...props, level: 1 })}
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
        <Swipeable
            onSwipeableOpen={(direction) => {
                if (direction === 'left' && canDemote) {
                    onDemoteTask(item.id, level);
                }
            }}
            renderLeftActions={canDemote ? () => renderLeftAction(item.id, level) : null}
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
                        {editingId === item.id ? (
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
                                    isDeleteMode && styles.taskTextTouchableDisabled
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
                                <Entypo style={styles.selectButtonText} name="add-to-list" />
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
                            <Entypo style={styles.dragHandleText} name="dots-three-vertical" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* 子タスク一覧 */}
                {item.children && item.children.length > 0 && (
                    <View style={styles.childrenContainer}>
                        <DraggableFlatList
                            data={item.children}
                            onDragEnd={({ data }) => onChildDragEnd(item.id, data, level + 1, parentId)}
                            keyExtractor={(child) => child.id}
                            renderItem={renderChildTask}
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

export default TaskItem;