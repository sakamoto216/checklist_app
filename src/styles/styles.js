import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#aaaaaa',
        paddingTop: 10, // StatusBar分を調整
        paddingHorizontal: 15,
        // 震え防止（translateZ削除）
        backfaceVisibility: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        backgroundColor: '#fff',
        marginRight: 10,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: '#555555', // 濃いグレー
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#ccc',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // 使用方法の説明
    instructionContainer: {
        padding: 8,
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 11,
        color: '#555555',
        fontWeight: '500',
    },
    // 削除モード表示
    deleteModeIndicator: {
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        padding: 10,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#FF5722',
    },
    deleteModeText: {
        fontSize: 12,
        color: '#D84315',
        fontWeight: '600',
        textAlign: 'center',
    },
    // 選択モード表示（オレンジアクセント）
    selectedModeIndicator: {
        backgroundColor: 'rgba(218, 123, 57, 0.1)', // シックなオレンジ
        padding: 10,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#DA7B39', // シックなオレンジアクセント
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedModeText: {
        fontSize: 12,
        color: '#B85A1C', // 濃いめのオレンジ
        fontWeight: '600',
        flex: 1,
    },
    // タスクコンテナ
    taskList: {
        flex: 1,
    },
    taskListContent: {
        paddingBottom: 70, // フラットフッター分の余白に調整
    },
    taskContainer: {
        marginBottom: 6,
        backgroundColor: '#DA7B39',
        borderRadius: 6,
    },
    taskContainerActive: {
        backgroundColor: 'rgba(218, 123, 57, 0.08)', // オレンジアクセント
        borderWidth: 2,
        borderColor: '#DA7B39', // オレンジアクセント
    },
    taskContainerDeleteMode: {
        backgroundColor: 'rgba(255, 87, 34, 0.05)',
    },
    // 編集コンテナ（追加）
    editContainer: {
        flex: 1,
    },
    // 親タスク
    parentTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 40,
        paddingVertical: 6,
        borderLeftWidth: 6,
        borderLeftColor: '#DA7B39', // オレンジアクセント
        minHeight: 50,
    },
    parentTaskItemSelected: {
        backgroundColor: '#FDF5F1', // 薄いオレンジ背景
        borderWidth: 2,
        borderColor: '#DA7B39', // オレンジアクセント
    },
    parentTaskItemDeleteMode: {
        backgroundColor: '#FFF3E0',
        borderLeftColor: '#FF5722',
    },
    // 削除モードボタン
    deleteModeButton: {
        width: 28,
        height: 28,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    deleteModeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteModeButtonChild: {
        width: 24,
        height: 24,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    deleteModeButtonTextChild: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    // チェックボックス
    checkboxContainer: {
        padding: 4,
    },
    checkboxContainerChild: {
        padding: 4,
    },
    checkboxContainerDisabled: {
        opacity: 0.5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChild: {
        width: 24,
        height: 24,
    },
    checkboxCompleted: {
        backgroundColor: '#DA7B39', // オレンジアクセント
        borderColor: '#DA7B39', // オレンジアクセント
    },
    checkboxDisabled: {
        opacity: 0.5,
    },
    checkboxText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    checkboxTextChild: {
        fontSize: 12,
    },
    // テキストエリア
    taskTextContainer: {
        flex: 2,
        paddingHorizontal: 6,
        paddingVertical: 8,
    },
    taskTextContainerChild: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    taskTextTouchable: {
        flex: 1,
        paddingVertical: 2,
    },
    taskTextTouchableChild: {
        paddingVertical: 1,
    },
    taskTextTouchableDisabled: {
        opacity: 0.6,
    },
    taskText: {
        fontSize: 14,
        color: '#333',
    },
    taskTextChild: {
        fontSize: 14,
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    taskTextDisabled: {
        opacity: 0.6,
    },
    // 編集フィールド
    editInput: {
        borderWidth: 1,
        borderColor: '#DA7B39', // オレンジアクセント
        padding: 5,
        backgroundColor: '#fff',
        fontSize: 14,
    },
    editInputChild: {
        fontSize: 12,
        padding: 4,
    },
    // ボタン群
    editActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    saveButton: {
        backgroundColor: '#DA7B39', // オレンジアクセント
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginRight: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    selectButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    selectButtonSelected: {
        backgroundColor: '#B85A1C', // 濃いオレンジ
    },
    selectButtonText: {
        color: '#DA7B39',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectButtonTextSelected: {
        fontSize: 14,
        color: '#DA7B39',
    },
    editButton: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginRight: 3,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    deleteButtonChild: {
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    deleteButtonTextChild: {
        fontSize: 9,
    },
    // ドラッグハンドル
    dragHandle: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 32,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragHandleText: {
        color: '#757575',
        fontSize: 14,
    },
    // 子タスク
    childrenContainer: {
        marginLeft: 20,
    },
    childTaskContainer: {
        marginTop: 3,
    },
    childTaskContainerActive: {
        backgroundColor: 'rgba(218, 123, 57, 0.08)', // オレンジアクセント
        borderWidth: 2,
        borderColor: '#DA7B39', // オレンジアクセント
    },
    childTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        paddingRight: 36, // ドラッグハンドル用の余白
        borderLeftWidth: 6,
        borderLeftColor: '#DA7B39', // オレンジアクセント
        minHeight: 42,
    },
    childTaskItemDeleteMode: {
        backgroundColor: '#FFF8E1',
        borderLeftColor: '#FF9800',
    },
    childTaskItemActive: {
        backgroundColor: '#FDF5F1', // 薄いオレンジ背景
        borderLeftColor: '#DA7B39', // オレンジアクセント
    },
    // 子タスクのドラッグハンドル
    childDragHandle: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 32,
        backgroundColor: '#E0E0E0', // 親と同じグレー系に統一
        justifyContent: 'center',
        alignItems: 'center',
    },
    childDragHandleText: {
        color: '#757575', // 親と同じグレー系に統一
        fontSize: 12,
    },
    // styles.js に追加する3階層対応スタイル

    // 孫タスクコンテナ
    grandchildrenContainer: {
        marginLeft: 15, // 子タスクより少し小さく
    },

    grandchildTaskContainer: {
        marginTop: 2,
    },

    grandchildTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8', // より薄いグレー
        paddingVertical: 6,
        paddingHorizontal: 10,
        paddingRight: 32,
        borderLeftWidth: 4, // 子タスクより細く
        borderLeftColor: '#FFA726', // 少し異なるオレンジ
        minHeight: 36, // 子タスクより小さく
    },

    grandchildTaskItemDeleteMode: {
        backgroundColor: '#FFF9C4',
        borderLeftColor: '#FFB300',
    },

    grandchildTaskItemActive: {
        backgroundColor: '#FFF3E0',
        borderLeftColor: '#FFA726',
    },

    // 孫タスクのチェックボックス
    checkboxGrandchild: {
        width: 20, // 子タスクより小さく
        height: 20,
    },

    checkboxTextGrandchild: {
        fontSize: 11, // 少し小さく
    },

    // 孫タスクのテキスト
    taskTextContainerGrandchild: {
        flex: 1,
        marginLeft: 8,
    },

    taskTextGrandchild: {
        fontSize: 14, // 親:16, 子:15, 孫:14
        color: '#666',
        lineHeight: 18,
    },

    taskTextTouchableGrandchild: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 4,
    },

    // 孫タスクの編集入力
    editInputGrandchild: {
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#FFA726',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#fff',
    },

    // 孫タスクの削除ボタン
    deleteModeButtonGrandchild: {
        width: 20,
        height: 20,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
        borderRadius: 10,
    },

    deleteModeButtonTextGrandchild: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // 孫タスクのドラッグハンドル
    grandchildDragHandle: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 28, // 親:32, 子:32, 孫:28
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    grandchildDragHandleText: {
        color: '#757575',
        fontSize: 10, // 少し小さく
    },

    // 階層インジケーター（視覚的区別用）
    taskLevelIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
    },

    parentLevelIndicator: {
        backgroundColor: '#DA7B39', // オレンジ
    },

    childLevelIndicator: {
        backgroundColor: '#FFA726', // 薄いオレンジ
    },

    grandchildLevelIndicator: {
        backgroundColor: '#FFD54F', // さらに薄いオレンジ
    },

    // 階層インジケーター（視覚的区別用）
    taskLevelIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
    },

    parentLevelIndicator: {
        backgroundColor: '#DA7B39', // オレンジ
    },

    childLevelIndicator: {
        backgroundColor: '#FFA726', // 薄いオレンジ
    },

    grandchildLevelIndicator: {
        backgroundColor: '#FFD54F', // さらに薄いオレンジ
    },
    // 右スワイプアクション（親タスク化）
    promoteAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        marginTop: 3,
        paddingHorizontal: 10,
    },
    promoteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',

    },
    promoteActionIcon: {
        fontSize: 20,
        marginTop: 2,
        color: '#fff',
    },
    // 左スワイプアクション（子タスク化）
    demoteAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        marginBottom: 4,
        paddingHorizontal: 10,
    },
    demoteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    demoteActionIcon: {
        fontSize: 20,
        marginTop: 2,
        color: '#fff',
    },
    // 選択中の親情報
    selectedParentInfo: {
        backgroundColor: '#FDF5F1', // 薄いオレンジ背景
        padding: 12,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#DA7B39', // オレンジアクセント
    },
    selectedParentText: {
        color: '#B85A1C', // 濃いオレンジ
        fontWeight: 'bold',
        flex: 1,
    },
    clearSelectionButton: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    clearSelectionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // フラットフッターエリア（位置固定強化版）
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: 'row',
        backgroundColor: '#fff',
        elevation: 8, // Android用の影
        shadowColor: '#000', // iOS用の影
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1000, // 他の要素より前面に表示
    },

    // フッター追加ボタン（左半分）- オレンジアクセント
    footerAddButton: {
        flex: 1,
        justifyContent: 'center', // 'top' から 'center' に変更
        alignItems: 'center',
        backgroundColor: '#DA7B39', // オレンジアクセント
        height: 70, // 明示的に高さ指定
    },

    footerAddButtonText: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '400',
    },

    // フッター削除ボタン（右半分）
    footerDeleteButton: {
        flex: 1,
        justifyContent: 'center', // 'top' から 'center' に変更
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 70, // 明示的に高さ指定
    },

    footerDeleteButtonActive: {
        backgroundColor: '#FF5722',
    },

    footerDeleteButtonText: {
        fontSize: 24,
        color: '#DA7B39',
    },

    footerDeleteButtonTextActive: {
        fontSize: 20,
        color: '#fff',
    },
});