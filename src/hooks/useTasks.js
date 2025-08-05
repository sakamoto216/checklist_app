import { useState } from 'react';

export const useTasks = () => {
    // 基本状態
    const [tasks, setTasks] = useState([]);

    // 編集状態（拡張版）
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editingLevel, setEditingLevel] = useState(0); // 0: 親, 1: 子, 2: 孫
    const [editingParentId, setEditingParentId] = useState(null);
    const [editingGrandparentId, setEditingGrandparentId] = useState(null);

    // 削除モード状態
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    // 3階層のタスクを検索するヘルパー関数
    const findTaskByPath = (taskId, parentId = null, grandparentId = null) => {
        for (const task of tasks) {
            // 親レベル
            if (task.id === taskId && !parentId) {
                return { task, level: 0 };
            }

            // 子レベル
            if (task.children) {
                for (const child of task.children) {
                    if (child.id === taskId && task.id === parentId && !grandparentId) {
                        return { task: child, level: 1, parent: task };
                    }

                    // 孫レベル
                    if (child.children) {
                        for (const grandchild of child.children) {
                            if (grandchild.id === taskId && child.id === parentId && task.id === grandparentId) {
                                return { task: grandchild, level: 2, parent: child, grandparent: task };
                            }
                        }
                    }
                }
            }
        }
        return null;
    };

    // 新しいタスクを追加（空の編集状態で）
    const addTask = (onTaskAdded, startEditing = true) => {
        const newTask = {
            id: Date.now().toString(),
            text: '',
            completed: false,
            children: [],
        };

        // console.log('Adding new task:', newTask.id);

        setTasks(currentTasks => {
            const newTasks = [...currentTasks, newTask];
            if (onTaskAdded) {
                onTaskAdded(newTasks.length - 1);
            }
            return newTasks;
        });

        // 編集モードを開始（オプション）
        if (startEditing) {
            // console.log('Setting editing mode for new task:', newTask.id);
            setEditingId(newTask.id);
            setEditingText('');
            setEditingLevel(0);
            setEditingParentId(null);
            setEditingGrandparentId(null);
        }
    };

    // 編集開始（3階層対応）
    const startEditing = (taskId, currentText, level = 0, parentId = null, grandparentId = null, onEditingStarted) => {
        if (isDeleteMode) return;

        setEditingId(taskId);
        setEditingText(currentText);
        setEditingLevel(level);
        setEditingParentId(parentId);
        setEditingGrandparentId(grandparentId);

        if (onEditingStarted) {
            onEditingStarted(taskId, level, parentId, grandparentId);
        }
    };

    // 編集キャンセル（フローティング対応版）
    const cancelEditing = () => {
        // console.log('cancelEditing called for:', editingId, 'text:', editingText);
        
        // 空のタスクの場合のみ削除（新規追加時のキャンセル）
        if (editingId && editingText.trim() === '') {
            // タスクが実際に存在し、かつ元々空だった場合のみ削除
            const taskExists = findTaskByPath(editingId, editingParentId, editingGrandparentId);
            // console.log('Task exists check:', taskExists);
            if (taskExists && taskExists.task.text === '') {
                // console.log('Deleting empty task:', editingId);
                deleteTask(editingId, editingLevel, editingParentId, editingGrandparentId);
            }
        }

        // console.log('Clearing editing state');
        setEditingId(null);
        setEditingText('');
        setEditingLevel(0);
        setEditingParentId(null);
        setEditingGrandparentId(null);
    };

    // 編集保存（3階層対応）
    const saveEdit = () => {
        if (editingText.trim() === '') {
            deleteTask(editingId, editingLevel, editingParentId, editingGrandparentId);
            cancelEditing();
            return;
        }

        setTasks(currentTasks => {
            return currentTasks.map(task => {
                if (editingLevel === 0 && task.id === editingId) {
                    // 親タスクの編集
                    return { ...task, text: editingText.trim() };
                }

                if (editingLevel === 1 && task.id === editingParentId) {
                    // 子タスクの編集
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === editingId
                                ? { ...child, text: editingText.trim() }
                                : child
                        )
                    };
                }

                if (editingLevel === 2 && task.id === editingGrandparentId) {
                    // 孫タスクの編集
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === editingParentId
                                ? {
                                    ...child,
                                    children: child.children.map(grandchild =>
                                        grandchild.id === editingId
                                            ? { ...grandchild, text: editingText.trim() }
                                            : grandchild
                                    )
                                }
                                : child
                        )
                    };
                }

                return task;
            });
        });

        cancelEditing();
    };

    // 子/孫タスク追加
    const addChildTask = (parentId, level = 1, grandparentId = null, onChildAdded) => {
        if (isDeleteMode) return;

        const newChildTask = {
            id: Date.now().toString(),
            text: '',
            completed: false,
            children: level < 2 ? [] : undefined, // 孫レベルは子を持たない
        };

        setTasks(currentTasks => {
            return currentTasks.map(task => {
                if (level === 1 && task.id === parentId) {
                    // 子タスク追加
                    return {
                        ...task,
                        children: [...task.children, newChildTask]
                    };
                }

                if (level === 2 && task.id === grandparentId) {
                    // 孫タスク追加
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === parentId
                                ? {
                                    ...child,
                                    children: [...(child.children || []), newChildTask]
                                }
                                : child
                        )
                    };
                }

                return task;
            });
        });

        // 新しいタスクの編集モードを開始
        setEditingId(newChildTask.id);
        setEditingText('');
        setEditingLevel(level);
        setEditingParentId(parentId);
        setEditingGrandparentId(grandparentId);

        if (onChildAdded) {
            onChildAdded(newChildTask.id, level, parentId, grandparentId);
        }
    };

    // タスクの完了状態切り替え（3階層対応）
    const toggleTask = (taskId, level = 0, parentId = null, grandparentId = null) => {
        if (isDeleteMode) return;

        setTasks(currentTasks => {
            return currentTasks.map(task => {
                if (level === 0 && task.id === taskId) {
                    // 親タスク
                    return { ...task, completed: !task.completed };
                }

                if (level === 1 && task.id === parentId) {
                    // 子タスク
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === taskId
                                ? { ...child, completed: !child.completed }
                                : child
                        )
                    };
                }

                if (level === 2 && task.id === grandparentId) {
                    // 孫タスク
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === parentId
                                ? {
                                    ...child,
                                    children: child.children.map(grandchild =>
                                        grandchild.id === taskId
                                            ? { ...grandchild, completed: !grandchild.completed }
                                            : grandchild
                                    )
                                }
                                : child
                        )
                    };
                }

                return task;
            });
        });
    };

    // タスク削除（3階層対応）
    const deleteTask = (taskId, level = 0, parentId = null, grandparentId = null) => {
        setTasks(currentTasks => {
            return currentTasks.map(task => {
                if (level === 0) {
                    // 親タスクの削除
                    return task.id === taskId ? null : task;
                }

                if (level === 1 && task.id === parentId) {
                    // 子タスクの削除
                    return {
                        ...task,
                        children: task.children.filter(child => child.id !== taskId)
                    };
                }

                if (level === 2 && task.id === grandparentId) {
                    // 孫タスクの削除
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === parentId
                                ? {
                                    ...child,
                                    children: child.children.filter(grandchild => grandchild.id !== taskId)
                                }
                                : child
                        )
                    };
                }

                return task;
            }).filter(Boolean);
        });
    };

    // 削除モード切り替え
    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        if (!isDeleteMode) {
            cancelEditing();
        }
    };

    // ドラッグ&ドロップ処理
    const handleDragEnd = ({ data }) => {
        setTasks(data);
    };

    const handleDragBegin = () => {
        if (editingId) {
            cancelEditing();
        }
    };

    // 子タスクのドラッグ&ドロップ
    const handleChildDragEnd = (parentId, newChildrenData, level = 1, grandparentId = null) => {
        setTasks(currentTasks => {
            return currentTasks.map(task => {
                if (level === 1 && task.id === parentId) {
                    // 子タスクの並び替え
                    return { ...task, children: newChildrenData };
                }

                if (level === 2 && task.id === grandparentId) {
                    // 孫タスクの並び替え
                    return {
                        ...task,
                        children: task.children.map(child =>
                            child.id === parentId
                                ? { ...child, children: newChildrenData }
                                : child
                        )
                    };
                }

                return task;
            });
        });
    };

    // 階層昇格（子→親、孫→子）- 孫は独立して子に昇格
    const promoteTask = (taskId, currentLevel, parentId = null, grandparentId = null) => {
        setTasks(currentTasks => {
            if (currentLevel === 1) {
                // 子タスクを親タスクに昇格（孫タスクは独立して子に昇格）
                let childToPromote = null;
                let grandchildrenToPromote = [];

                const updatedTasks = currentTasks.map(task => {
                    if (task.id === parentId) {
                        const child = task.children.find(c => c.id === taskId);
                        if (child) {
                            // 昇格する子タスク（孫なし）
                            childToPromote = {
                                ...child,
                                children: [] // 新しい親は孫を持たない
                            };

                            // 孫タスクがある場合は独立して子レベルに昇格
                            if (child.children && child.children.length > 0) {
                                grandchildrenToPromote = child.children.map(gc => ({
                                    ...gc,
                                    children: [] // 昇格した孫は子を持たない
                                }));
                            }
                        }
                        return {
                            ...task,
                            children: [
                                ...task.children.filter(c => c.id !== taskId),
                                ...grandchildrenToPromote // 孫を子として追加
                            ]
                        };
                    }
                    return task;
                });

                if (childToPromote) {
                    // 昇格した子（新しい親）を追加
                    return [...updatedTasks, childToPromote];
                }
                return updatedTasks;

            } else if (currentLevel === 2) {
                // 孫タスクを子タスクに昇格
                return currentTasks.map(task => {
                    if (task.id === grandparentId) {
                        let grandchildToPromote = null;

                        const updatedChildren = task.children.map(child => {
                            if (child.id === parentId) {
                                const grandchild = child.children?.find(gc => gc.id === taskId);
                                if (grandchild) {
                                    grandchildToPromote = { ...grandchild, children: [] };
                                }
                                return {
                                    ...child,
                                    children: child.children?.filter(gc => gc.id !== taskId) || []
                                };
                            }
                            return child;
                        });

                        if (grandchildToPromote) {
                            updatedChildren.push(grandchildToPromote);
                        }

                        return { ...task, children: updatedChildren };
                    }
                    return task;
                });
            }

            return currentTasks;
        });
    };

    // 階層降格（親→子、子→孫）- 修正版
    const demoteTask = (taskId, currentLevel, parentId = null, grandparentId = null) => {
        setTasks(currentTasks => {
            if (currentLevel === 0) {
                // 親タスクを前の親の子タスクに降格
                const taskIndex = currentTasks.findIndex(task => task.id === taskId);
                if (taskIndex <= 0) return currentTasks; // 最初のタスクは降格不可

                const taskToMove = currentTasks[taskIndex];
                const targetParent = currentTasks[taskIndex - 1];

                // 孫タスクがある場合の処理
                let grandchildrenToPromote = [];
                if (taskToMove.children) {
                    taskToMove.children.forEach(child => {
                        if (child.children && child.children.length > 0) {
                            // 孫タスクを子レベルに昇格させて保存
                            grandchildrenToPromote.push(...child.children.map(gc => ({
                                ...gc,
                                children: [] // 孫は子を持たない
                            })));
                        }
                    });
                }

                const newTasks = currentTasks.filter(task => task.id !== taskId);

                return newTasks.map(task => {
                    if (task.id === targetParent.id) {
                        const demotedTask = {
                            ...taskToMove,
                            children: taskToMove.children?.map(child => ({
                                ...child,
                                children: [] // 孫は消去（別途昇格処理）
                            })) || []
                        };

                        // 降格したタスクと昇格した孫タスクを追加
                        return {
                            ...task,
                            children: [
                                ...task.children,
                                demotedTask,
                                ...grandchildrenToPromote // 孫タスクを子として追加
                            ]
                        };
                    }
                    return task;
                });

            } else if (currentLevel === 1) {
                // 子タスクを前の子の孫に降格
                return currentTasks.map(task => {
                    if (task.id === parentId) {
                        const childIndex = task.children.findIndex(child => child.id === taskId);
                        if (childIndex <= 0) return task; // 最初の子は降格不可

                        const childToMove = task.children[childIndex];
                        const targetParentChild = task.children[childIndex - 1];

                        // 降格する子が孫を持っている場合の処理
                        let grandchildrenToPromote = [];
                        if (childToMove.children && childToMove.children.length > 0) {
                            // 孫タスクを子レベルに昇格させて保存
                            grandchildrenToPromote = childToMove.children.map(gc => ({
                                ...gc,
                                children: [] // 昇格した孫は子を持たない
                            }));
                        }

                        const demotedChild = {
                            ...childToMove,
                            children: [] // 降格した子は孫を持たない（別途昇格処理）
                        };

                        const updatedChildren = [...task.children];
                        // 移動する子を削除
                        updatedChildren.splice(childIndex, 1);
                        // 前の子の孫として追加
                        updatedChildren[childIndex - 1] = {
                            ...targetParentChild,
                            children: [...(targetParentChild.children || []), demotedChild]
                        };

                        // 昇格させる孫タスクを子として追加
                        if (grandchildrenToPromote.length > 0) {
                            updatedChildren.push(...grandchildrenToPromote);
                        }

                        return { ...task, children: updatedChildren };
                    }
                    return task;
                });
            }

            return currentTasks;
        });
    };

    // 全件チェック機能
    const checkAllTasks = () => {
        if (isDeleteMode) return;

        setTasks(currentTasks => {
            return currentTasks.map(task => {
                const updatedTask = { ...task, completed: true };
                
                // 子タスクも全てチェック
                if (task.children) {
                    updatedTask.children = task.children.map(child => {
                        const updatedChild = { ...child, completed: true };
                        
                        // 孫タスクも全てチェック
                        if (child.children) {
                            updatedChild.children = child.children.map(grandchild => ({
                                ...grandchild,
                                completed: true
                            }));
                        }
                        
                        return updatedChild;
                    });
                }
                
                return updatedTask;
            });
        });
    };

    // 全件チェック解除機能
    const uncheckAllTasks = () => {
        if (isDeleteMode) return;

        setTasks(currentTasks => {
            return currentTasks.map(task => {
                const updatedTask = { ...task, completed: false };
                
                // 子タスクも全てチェック解除
                if (task.children) {
                    updatedTask.children = task.children.map(child => {
                        const updatedChild = { ...child, completed: false };
                        
                        // 孫タスクも全てチェック解除
                        if (child.children) {
                            updatedChild.children = child.children.map(grandchild => ({
                                ...grandchild,
                                completed: false
                            }));
                        }
                        
                        return updatedChild;
                    });
                }
                
                return updatedTask;
            });
        });
    };

    // 全タスク削除（初期化）機能
    const clearAllTasks = () => {
        console.log('🗑️ useTasks: clearAllTasks called');
        
        // 編集モードをキャンセル
        if (editingId) {
            cancelEditing();
        }
        
        // 削除モードを無効化
        if (isDeleteMode) {
            setIsDeleteMode(false);
        }
        
        // 全タスクを削除して空のタスクを1つ作成
        const initialTask = {
            id: Date.now().toString(),
            text: '',
            completed: false,
            children: [],
        };
        
        setTasks([initialTask]);
        
        // 新しいタスクの編集モードを開始
        setEditingId(initialTask.id);
        setEditingText('');
        setEditingLevel(0);
        setEditingParentId(null);
        setEditingGrandparentId(null);
        
        console.log('🗑️ useTasks: All tasks cleared, new empty task created');
    };

    return {
        // State
        tasks,
        editingId,
        editingText,
        editingLevel,
        editingParentId,
        editingGrandparentId,
        isDeleteMode,

        // Setters
        setTasks,
        setEditingText,

        // Actions
        addTask,
        startEditing,
        cancelEditing,
        saveEdit,
        addChildTask, // 従来のtoggleParentSelectionの代替
        toggleTask,
        deleteTask,
        toggleDeleteMode,
        handleDragEnd,
        handleDragBegin,
        handleChildDragEnd,
        promoteTask,
        demoteTask,
        findTaskByPath,
        checkAllTasks,
        uncheckAllTasks,
        clearAllTasks,
    };
};