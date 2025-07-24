import { useState, useEffect } from 'react';
import { Keyboard, Platform, Dimensions } from 'react-native';

export const useKeyboard = (flatListRef, tasks) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [screenHeight] = useState(Dimensions.get('window').height);

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
            // キーボードの高さに基づいて動的にviewPositionを調整
            // キーボードが表示されているときはより上部にスクロール
            let viewPosition;

            if (keyboardHeight > 0) {
                // キーボード表示時: 画面の上部1/3程度に配置
                viewPosition = Platform.OS === 'android' ? 0.25 : 0.3;
            } else {
                // キーボード非表示時: 画面の中央に配置
                viewPosition = Platform.OS === 'android' ? 0.4 : 0.45;
            }

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
        }, Platform.OS === 'android' ? 500 : 400);
    };

    // 新規タスク追加時のスクロール
    const scrollToNewTask = (taskIndex) => {
        setTimeout(() => {
            if (flatListRef.current && taskIndex >= 0) {
                // 新規タスクは常に画面の上部1/3に表示
                const viewPosition = Platform.OS === 'android' ? 0.25 : 0.3;

                try {
                    flatListRef.current.scrollToIndex({
                        index: taskIndex,
                        animated: true,
                        viewPosition: viewPosition,
                    });
                } catch (error) {
                    // インデックスが無効な場合は最下部にスクロール
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            }
        }, Platform.OS === 'android' ? 200 : 150);
    };

    // スクロールエラーハンドリング（改善版）
    const handleScrollToIndexFailed = (info) => {
        console.log('ScrollToIndex failed:', info);

        // エラー時はより安全にスクロール
        setTimeout(() => {
            if (flatListRef.current) {
                try {
                    // 最大インデックスを超えている場合は最下部にスクロール
                    if (info.index >= tasks.length) {
                        flatListRef.current.scrollToEnd({ animated: true });
                    } else {
                        // 有効なインデックスなら再試行
                        flatListRef.current.scrollToIndex({
                            index: Math.min(info.index, tasks.length - 1),
                            animated: true,
                            viewPosition: 0.3,
                        });
                    }
                } catch (retryError) {
                    // 再試行も失敗した場合は最下部にスクロール
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }
        }, 150);
    };

    // 手動でキーボードを考慮したスクロール位置を計算
    const scrollToPosition = (index, animated = true) => {
        if (!flatListRef.current || index < 0 || index >= tasks.length) return;

        // アイテムの推定高さ（親タスク + 子タスク）
        const estimatedItemHeight = 60;
        const offset = index * estimatedItemHeight;

        // キーボードを考慮したスクロール位置
        const availableHeight = screenHeight - keyboardHeight - 150; // 150はヘッダー+フッター
        const targetOffset = Math.max(0, offset - (availableHeight * 0.3));

        flatListRef.current.scrollToOffset({
            offset: targetOffset,
            animated
        });
    };

    return {
        keyboardHeight,
        scrollToEditingItem,
        scrollToNewTask,
        handleScrollToIndexFailed,
        scrollToPosition, // 追加の手動スクロール関数
    };
};