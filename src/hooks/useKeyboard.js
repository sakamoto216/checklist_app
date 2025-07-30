import { useState, useEffect } from 'react';
import { Keyboard, Platform, Dimensions } from 'react-native';

export const useKeyboard = (flatListRef, tasks) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [screenHeight] = useState(Dimensions.get('window').height);

    // キーボードイベントリスナー（より早いタイミングでの検知を追加）
    useEffect(() => {
        let keyboardWillShowListener, keyboardWillHideListener;
        let keyboardDidShowListener, keyboardDidHideListener;
        
        if (Platform.OS === 'ios') {
            // iOSでは'will'イベントを使用してより早いタイミングで検知
            keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            });
            keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
                setKeyboardHeight(0);
            });
        }
        
        // フォールバックとして'did'イベントも監視
        keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardWillShowListener?.remove();
            keyboardWillHideListener?.remove();
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    // 編集中のアイテムにスクロールする関数（改良版）
    const scrollToEditingItem = (taskId, isChild = false, parentId = null, level = 0) => {
        if (!flatListRef.current) return;

        const performScroll = () => {
            if (!flatListRef.current) return;
            
            try {
                // キーボード表示時は画面上部に、非表示時は中央に配置
                const viewPosition = keyboardHeight > 0 
                    ? (Platform.OS === 'android' ? 0.1 : 0.15)  // キーボード表示時は上部
                    : (Platform.OS === 'android' ? 0.3 : 0.35); // 非表示時は中央

                if (isChild) {
                    // 子・孫タスクの場合は親タスクを基準にスクロール
                    const parentIndex = tasks.findIndex(task => task.id === parentId);
                    if (parentIndex !== -1) {
                        flatListRef.current.scrollToIndex({
                            index: parentIndex,
                            animated: true,
                            viewPosition: viewPosition,
                        });
                    }
                } else {
                    // 親タスクの場合
                    const taskIndex = tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        flatListRef.current.scrollToIndex({
                            index: taskIndex,
                            animated: true,
                            viewPosition: viewPosition,
                        });
                    }
                }
            } catch (error) {
                // スクロール失敗時は最下部にスクロール
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        };

        // 複数回の再試行でスクロールを確実に実行
        let attempts = 0;
        const maxAttempts = 3;
        
        const tryScroll = () => {
            attempts++;
            setTimeout(() => {
                performScroll();
                
                // 失敗した場合は再試行
                if (attempts < maxAttempts) {
                    setTimeout(tryScroll, 200 * attempts);
                }
            }, attempts === 1 ? 100 : 200 * attempts);
        };

        tryScroll();
    };

    // 新規タスク追加時のスクロール（改良版）
    const scrollToNewTask = (taskIndex) => {
        if (!flatListRef.current || taskIndex < 0) return;

        const performScrollToNew = () => {
            if (!flatListRef.current) return;
            
            try {
                // 新規タスクは画面上部に表示
                const viewPosition = Platform.OS === 'android' ? 0.1 : 0.2;
                
                flatListRef.current.scrollToIndex({
                    index: taskIndex,
                    animated: true,
                    viewPosition: viewPosition,
                });
            } catch (error) {
                // インデックスが無効な場合は最下部にスクロール
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        };

        // 新規タスク追加時も複数回再試行
        let attempts = 0;
        const maxAttempts = 3;
        
        const tryScrollToNew = () => {
            attempts++;
            setTimeout(() => {
                performScrollToNew();
                
                if (attempts < maxAttempts) {
                    setTimeout(tryScrollToNew, 150 * attempts);
                }
            }, attempts === 1 ? 100 : 150 * attempts);
        };

        tryScrollToNew();
    };

    // スクロールエラーハンドリング（改善版）
    const handleScrollToIndexFailed = (info) => {
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
                            viewPosition: 0.2,
                        });
                    }
                } catch (retryError) {
                    // 再試行も失敗した場合は最下部にスクロール
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }
        }, 150);
    };

    return {
        keyboardHeight,
        scrollToEditingItem,
        scrollToNewTask,
        handleScrollToIndexFailed,
    };
};