import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useKeyboard = (flatListRef, tasks) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // キーボードイベントリスナー
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // 編集中のアイテムにスクロールする関数
    const scrollToEditingItem = (taskId, isChild = false, parentId = null) => {
        if (!flatListRef.current) return;

        setTimeout(() => {
            const viewPosition = Platform.OS === 'android' ? 0.15 : 0.3;

            if (isChild) {
                const parentIndex = tasks.findIndex(task => task.id === parentId);
                if (parentIndex !== -1) {
                    flatListRef.current?.scrollToIndex({
                        index: parentIndex,
                        animated: true,
                        viewPosition: viewPosition,
                    });
                }
            } else {
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    flatListRef.current?.scrollToIndex({
                        index: taskIndex,
                        animated: true,
                        viewPosition: viewPosition,
                    });
                }
            }
        }, Platform.OS === 'android' ? 400 : 300);
    };

    // 新規タスク追加時のスクロール
    const scrollToNewTask = (taskIndex) => {
        setTimeout(() => {
            if (flatListRef.current) {
                const viewPosition = Platform.OS === 'android' ? 0.15 : 0.3;
                flatListRef.current.scrollToIndex({
                    index: taskIndex,
                    animated: true,
                    viewPosition: viewPosition,
                });
            }
        }, Platform.OS === 'android' ? 150 : 100);
    };

    // スクロールエラーハンドリング
    const handleScrollToIndexFailed = (info) => {
        console.log('ScrollToIndex failed:', info);
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return {
        keyboardHeight,
        scrollToEditingItem,
        scrollToNewTask,
        handleScrollToIndexFailed,
    };
};