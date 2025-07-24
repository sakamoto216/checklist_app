import { useState } from 'react';

export const useTasks = () => {
    // 基本状態
    const [tasks, setTasks] = useState([]);

    // 編集状態
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [isEditingChild, setIsEditingChild] = useState(false);
    const [editingParentId, setEditingParentId] = useState(null);

    // 削除モード状態
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    // 新しいタスクを追加（空の編集状態で）
    const addTask = (onTaskAdded) => {
        const newTask = {
            id: Date.now().toString(),
            text: '',
            completed: false,
            children: [],
        };

        setTasks(currentTasks => {
            const newTasks = [...currentTasks, newTask];
            if (onTaskAdded) {
                onTaskAdded(newTasks.length - 1);
            }
            return newTasks;
        });

        // 編集モードを開始
        setEditingId(newTask.id);
        setEditingText('');
        setIsEditingChild(false);
        setEditingParentId(null);
    };

    // 編集開始
    const startEditing = (taskId, currentText, isChild = false, parentId = null, onEditingStarted) => {
        if (isDeleteMode) return;

        setEditingId(taskId);
        setEditingText(currentText);
        setIsEditingChild(isChild);
        setEditingParentId(parentId);

        if (onEditingStarted) {
            onEditingStarted(taskId, isChild, parentId);
        }
    };

    // 編集キャンセル
    const cancelEditing = () => {
        if (editingId && editingText.trim() === '') {
            deleteTask(editingId, isEditingChild, editingParentId);
        }

        setEditingId(null);
        setEditingText('');
        setIsEditingChild(false);
        setEditingParentId(null);
    };

    // 編集保存
    const saveEdit = () => {
        if (editingText.trim() === '') {
            deleteTask(editingId, isEditingChild, editingParentId);
            cancelEditing();
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

    // 子タスク追加
    const toggleParentSelection = (parentId, onChildAdded) => {
        if (isDeleteMode) return;

        const newChildTask = {
            id: Date.now().toString(),
            text: '',
            completed: false,
        };

        setTasks(currentTasks => currentTasks.map(task =>
            task.id === parentId
                ? { ...task, children: [...task.children, newChildTask] }
                : task
        ));

        // 子タスクの編集モードを開始
        setEditingId(newChildTask.id);
        setEditingText('');
        setIsEditingChild(true);
        setEditingParentId(parentId);

        if (onChildAdded) {
            onChildAdded(newChildTask.id, true, parentId);
        }
    };

    // タスクの完了状態切り替え
    const toggleTask = (taskId, isChild = false, parentId = null) => {
        if (isDeleteMode) return;

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

    // タスク削除
    const deleteTask = (taskId, isChild = false, parentId = null) => {
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
        }
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
    const handleChildDragEnd = (parentId, newChildrenData) => {
        setTasks(currentTasks => currentTasks.map(task =>
            task.id === parentId
                ? { ...task, children: newChildrenData }
                : task
        ));
    };

    // 子タスクを親タスクに昇格
    const promoteChildToParent = (childId, parentId) => {
        let childTask = null;

        const updatedTasks = tasks.map(task => {
            if (task.id === parentId) {
                const child = task.children.find(c => c.id === childId);
                if (child) {
                    childTask = { ...child, children: [] };
                }
                return {
                    ...task,
                    children: task.children.filter(c => c.id !== childId)
                };
            }
            return task;
        });

        if (childTask) {
            setTasks([...updatedTasks, childTask]);
        } else {
            setTasks(updatedTasks);
        }
    };

    // 親タスクを子タスクに降格
    const demoteParentToChild = (taskId) => {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex <= 0) return;

        const targetTask = tasks[taskIndex];
        const parentTask = tasks[taskIndex - 1];

        setTasks(currentTasks => {
            const newTasks = currentTasks.filter(task => task.id !== taskId);
            return newTasks.map(task =>
                task.id === parentTask.id
                    ? {
                        ...task,
                        children: [
                            ...task.children,
                            { ...targetTask, children: [] },
                            ...targetTask.children
                        ]
                    }
                    : task
            );
        });
    };

    return {
        // State
        tasks,
        editingId,
        editingText,
        isEditingChild,
        editingParentId,
        isDeleteMode,

        // Setters
        setTasks,
        setEditingText,

        // Actions
        addTask,
        startEditing,
        cancelEditing,
        saveEdit,
        toggleParentSelection,
        toggleTask,
        deleteTask,
        toggleDeleteMode,
        handleDragEnd,
        handleDragBegin,
        handleChildDragEnd,
        promoteChildToParent,
        demoteParentToChild,
    };
};