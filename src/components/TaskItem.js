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
    onToggleParentSelection,
    onDemoteParentToChild,
    onPromoteChildToParent,
    onChildDragEnd,
}) => {
    const index = getIndex ? getIndex() : 0;
    const canDemote = index > 0;

    // 右スワイプアクション（親タスク化）
    const renderRightAction = (childId, parentId) => {
        return (
            <TouchableOpacity
                style={styles.promoteAction}
                onPress={() => onPromoteChildToParent(childId, parentId)}
                activeOpacity={0.7}
            >
                <AntDesign style={styles.promoteActionIcon} name="indent-left" />
            </TouchableOpacity>
        );
    };

    // 左スワイプアクション（子タスク化）
    const renderLeftAction = (taskId) => {
        return (
            <TouchableOpacity
                style={styles.demoteAction}
                onPress={() => onDemoteParentToChild(taskId)}
                activeOpacity={0.7}
            >
                <AntDesign style={styles.promoteActionIcon} name="indent-right" />
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            onSwipeableOpen={(direction) => {
                if (direction === 'left' && canDemote) {
                    onDemoteParentToChild(item.id);
                }
            }}
            renderLeftActions={canDemote ? () => renderLeftAction(item.id) : null}
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
                            onPress={() => onDeleteTask(item.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.deleteModeButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.checkboxContainer,
                            isDeleteMode && styles.checkboxContainerDisabled
                        ]}
                        onPress={() => onToggleTask(item.id)}
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
                                onPress={() => onStartEditing(item.id, item.text)}
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

                    {/* 通常モード時のボタン群 */}
                    {!isDeleteMode && editingId !== item.id && (
                        <View style={styles.editActions}>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => onToggleParentSelection(item.id)}
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
                            <Entypo style={styles.childDragHandleText} name="dots-three-vertical" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* 子タスク一覧 */}
                {item.children && item.children.length > 0 && (
                    <View style={styles.childrenContainer}>
                        <DraggableFlatList
                            data={item.children}
                            onDragEnd={({ data }) => onChildDragEnd(item.id, data)}
                            keyExtractor={(child) => child.id}
                            renderItem={({ item: child, drag: childDrag, isActive: isChildActive }) => (
                                <Swipeable
                                    onSwipeableOpen={(direction) => {
                                        if (direction === 'right') {
                                            onPromoteChildToParent(child.id, item.id);
                                        }
                                    }}
                                    renderRightActions={() => renderRightAction(child.id, item.id)}
                                    enabled={!isDeleteMode && editingId !== child.id}
                                    rightThreshold={40}
                                >
                                    <View style={[
                                        styles.childTaskContainer,
                                        isChildActive && styles.childTaskContainerActive
                                    ]}>
                                        <View style={[
                                            styles.childTaskItem,
                                            isDeleteMode && styles.childTaskItemDeleteMode,
                                            isChildActive && styles.childTaskItemActive
                                        ]}>
                                            {/* 子タスクの削除ボタン */}
                                            {isDeleteMode && (
                                                <TouchableOpacity
                                                    style={styles.deleteModeButtonChild}
                                                    onPress={() => onDeleteTask(child.id, true, item.id)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={styles.deleteModeButtonTextChild}>✕</Text>
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity
                                                style={[
                                                    styles.checkboxContainerChild,
                                                    isDeleteMode && styles.checkboxContainerDisabled
                                                ]}
                                                onPress={() => onToggleTask(child.id, true, item.id)}
                                                activeOpacity={isDeleteMode ? 1 : 0.7}
                                                disabled={isDeleteMode}
                                            >
                                                <View style={[
                                                    styles.checkbox,
                                                    styles.checkboxChild,
                                                    child.completed && styles.checkboxCompleted,
                                                    isDeleteMode && styles.checkboxDisabled
                                                ]}>
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
                                                        onSubmitEditing={onSaveEdit}
                                                        onBlur={onCancelEditing}
                                                        autoFocus
                                                        placeholder="子タスク名を入力..."
                                                    />
                                                ) : (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.taskTextTouchable,
                                                            styles.taskTextTouchableChild,
                                                            isDeleteMode && styles.taskTextTouchableDisabled
                                                        ]}
                                                        onPress={() => onStartEditing(child.id, child.text, true, item.id)}
                                                        activeOpacity={isDeleteMode ? 1 : 0.7}
                                                        disabled={isDeleteMode}
                                                    >
                                                        <Text style={[
                                                            styles.taskText,
                                                            styles.taskTextChild,
                                                            child.completed && styles.taskTextCompleted,
                                                            isDeleteMode && styles.taskTextDisabled
                                                        ]}>
                                                            {child.text || '未入力の子タスク'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            {/* 子タスクのドラッグハンドル */}
                                            {!isDeleteMode && (
                                                <TouchableOpacity
                                                    style={styles.childDragHandle}
                                                    onLongPress={childDrag}
                                                    delayLongPress={100}
                                                >
                                                    <Entypo style={styles.childDragHandleText} name="dots-three-vertical" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </Swipeable>
                            )}
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