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
        return (
            <TouchableOpacity
                style={styles.promoteAction}
                onPress={() => {
                    console.log(`Right action pressed: taskId=${taskId}, level=${currentLevel}`);
                    onPromoteTask(taskId, currentLevel, parentId, grandparentId);
                }}
                activeOpacity={0.7}
            >
                <AntDesign style={styles.promoteActionIcon} name="arrow-up" />
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
    const renderChildTask = ({ item: child, drag: childDrag, isActive: isChildActive, getIndex: getChildIndex }) => {
        const childLevel = level + 1;
        const childParentId = level === 0 ? item.id : parentId;
        const childGrandparentId = level === 0 ? null : (level === 1 ? item.id : grandparentId);
        const childIndex = getChildIndex ? getChildIndex() : 0;

        // スワイプ可能条件
        const canPromote = childLevel > 0; // 子・孫は昇格可能
        const canDemote = childLevel === 1 && childIndex > 0; // 子の場合、先頭以外は降格可能

        console.log(`Child ${child.text}: level=${childLevel}, index=${childIndex}, canPromote=${canPromote}, canDemote=${canDemote}`);

        return (
            <Swipeable
                onSwipeableOpen={(direction) => {
                    console.log(`Swipe ${direction} on child ${child.text}, level=${childLevel}, index=${childIndex}`);
                    if (direction === 'right' && canPromote) {
                        // 右スワイプで昇格
                        console.log('Promoting child to parent');
                        onPromoteTask(child.id, childLevel, childParentId, childGrandparentId);
                    } else if (direction === 'left' && canDemote) {
                        // 左スワイプで降格（子→孫）
                        console.log('Demoting child to grandchild');
                        onDemoteTask(child.id, childLevel, childParentId, childGrandparentId);
                    } else {
                        console.log(`Swipe action not allowed: canPromote=${canPromote}, canDemote=${canDemote}`);
                    }
                }}
                renderRightActions={canPromote ? () => renderRightAction(child.id, childLevel, childParentId, childGrandparentId) : null}
                renderLeftActions={canDemote ? () => renderLeftAction(child.id, childLevel) : null}
                enabled={!isDeleteMode && editingId !== child.id}
                rightThreshold={50}
                leftThreshold={50}
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
                                renderItem={({ item: grandchild, drag: grandchildDrag, isActive: isGrandchildActive, getIndex: getGrandchildIndex }) => {
                                    const grandchildIndex = getGrandchildIndex ? getGrandchildIndex() : 0;
                                    console.log(`Grandchild ${grandchild.text}: level=2, index=${grandchildIndex}, canPromote=true`);

                                    return (
                                        <Swipeable
                                            onSwipeableOpen={(direction) => {
                                                console.log(`Swipe ${direction} on grandchild ${grandchild.text}, level=2, index=${grandchildIndex}`);
                                                if (direction === 'right') {
                                                    // 孫タスクを子に昇格
                                                    console.log('Promoting grandchild to child');
                                                    onPromoteTask(grandchild.id, 2, child.id, item.id);
                                                }
                                            }}
                                            renderRightActions={() => renderRightAction(grandchild.id, 2, child.id, item.id)}
                                            enabled={!isDeleteMode && editingId !== grandchild.id}
                                            rightThreshold={50}
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
                                                    <View style={[
                                                        styles.taskTextContainer,
                                                        styles.taskTextContainerGrandchild
                                                    ]}>
                                                        {editingId === grandchild.id ? (
                                                            <TextInput
                                                                style={[
                                                                    styles.editInput,
                                                                    styles.editInputGrandchild
                                                                ]}
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
                                                                    styles.taskTextTouchable,
                                                                    styles.taskTextTouchableGrandchild,
                                                                    isDeleteMode && styles.taskTextTouchableDisabled
                                                                ]}
                                                                onPress={() => onStartEditing(grandchild.id, grandchild.text, 2, child.id, item.id)}
                                                                activeOpacity={isDeleteMode ? 1 : 0.7}
                                                                disabled={isDeleteMode}
                                                            >
                                                                <Text style={[
                                                                    styles.taskText,
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
                                                            onLongPress={grandchildDrag}
                                                            delayLongPress={100}
                                                        >
                                                            <Entypo style={styles.grandchildDragHandleText} name="dots-three-vertical" />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </Swipeable>
                                    );
                                }}
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
                console.log(`Swipe ${direction} on parent ${item.text}, level=${level}, canDemote=${canDemote}`);
                if (direction === 'left' && level === 0 && canDemote) {
                    // 親タスクを子に降格
                    console.log('Demoting parent to child');
                    onDemoteTask(item.id, level, parentId, grandparentId);
                }
            }}
            renderLeftActions={level === 0 && canDemote ? () => renderLeftAction(item.id, level) : null}
            enabled={!isDeleteMode && editingId !== item.id}
            leftThreshold={50}
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
                            renderItem={({ item: child, drag: childDrag, isActive: isChildActive, getIndex: getChildIndex }) => {
                                const childLevel = level + 1;
                                const childParentId = level === 0 ? item.id : parentId;
                                const childGrandparentId = level === 0 ? null : (level === 1 ? item.id : grandparentId);
                                const childIndex = getChildIndex ? getChildIndex() : 0;

                                // スワイプ可能条件
                                const canPromote = childLevel > 0; // 子・孫は昇格可能
                                const canDemote = childLevel === 1 && childIndex > 0; // 子の場合、先頭以外は降格可能

                                console.log(`CHILD RENDER: ${child.text} - level=${childLevel}, index=${childIndex}, canPromote=${canPromote}, canDemote=${canDemote}`);

                                return (
                                    <Swipeable
                                        onSwipeableOpen={(direction) => {
                                            console.log(`SWIPE ${direction} on child ${child.text}, level=${childLevel}, index=${childIndex}`);
                                            if (direction === 'right' && canPromote) {
                                                // 右スワイプで昇格
                                                console.log('PROMOTING CHILD to parent');
                                                onPromoteTask(child.id, childLevel, childParentId, childGrandparentId);
                                            } else if (direction === 'left' && canDemote) {
                                                // 左スワイプで降格（子→孫）
                                                console.log('DEMOTING CHILD to grandchild');
                                                onDemoteTask(child.id, childLevel, childParentId, childGrandparentId);
                                            } else {
                                                console.log(`SWIPE BLOCKED: direction=${direction}, canPromote=${canPromote}, canDemote=${canDemote}`);
                                            }
                                        }}
                                        renderRightActions={canPromote ? () => renderRightAction(child.id, childLevel, childParentId, childGrandparentId) : null}
                                        renderLeftActions={canDemote ? () => renderLeftAction(child.id, childLevel) : null}
                                        enabled={!isDeleteMode && editingId !== child.id}
                                        rightThreshold={50}
                                        leftThreshold={50}
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
                                                {/* 削除ボタン */}
                                                {isDeleteMode && (
                                                    <TouchableOpacity
                                                        style={styles.deleteModeButtonChild}
                                                        onPress={() => onDeleteTask(child.id, childLevel, childParentId, childGrandparentId)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={styles.deleteModeButtonTextChild}>✕</Text>
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
                                                        styles.checkboxChild,
                                                        child.completed && styles.checkboxCompleted,
                                                        isDeleteMode && styles.checkboxDisabled
                                                    ]}>
                                                        <Text style={[
                                                            styles.checkboxText,
                                                            styles.checkboxTextChild
                                                        ]}>
                                                            {child.completed ? '✓' : ''}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                                {/* テキスト入力/表示エリア */}
                                                <View style={[
                                                    styles.taskTextContainer,
                                                    styles.taskTextContainerChild
                                                ]}>
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
                                                            onPress={() => onStartEditing(child.id, child.text, childLevel, childParentId, childGrandparentId)}
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
                                );
                            }}
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