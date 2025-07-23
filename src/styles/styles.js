import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#aaaaaa',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        color: '#fff',
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
        borderRadius: 8,
        padding: 14,
        backgroundColor: '#fff',
        marginRight: 10,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
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
        backgroundColor: 'rgba(0, 150, 136, 0.1)',
        padding: 8,
        marginBottom: 10,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#009688',
    },
    instructionText: {
        fontSize: 11,
        color: '#00695C',
        fontWeight: '500',
    },
    // 削除モード表示
    deleteModeIndicator: {
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        padding: 10,
        marginBottom: 10,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#FF5722',
    },
    deleteModeText: {
        fontSize: 12,
        color: '#D84315',
        fontWeight: '600',
        textAlign: 'center',
    },
    // タスクコンテナ
    taskList: {
        flex: 1,
    },
    taskListContent: {
        paddingBottom: 20, // フッターの高さ分余白を削除
    },
    taskContainer: {
        marginBottom: 4,
    },
    taskContainerActive: {
        backgroundColor: 'rgba(0, 150, 136, 0.1)',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#009688',
        shadowColor: '#009688',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    taskContainerDeleteMode: {
        backgroundColor: 'rgba(255, 87, 34, 0.05)',
    },
    // 親タスク
    parentTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 40,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderLeftWidth: 6,
        borderLeftColor: '#007AFF',
        minHeight: 50,
    },
    parentTaskItemSelected: {
        backgroundColor: '#E8F5E8',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    parentTaskItemDeleteMode: {
        backgroundColor: '#FFF3E0',
        borderLeftColor: '#FF5722',
    },
    // 削除モードボタン
    deleteModeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    deleteModeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteModeButtonChild: {
        width: 24,
        height: 24,
        borderRadius: 12,
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
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChild: {
        width: 20,
        height: 20,
    },
    checkboxCompleted: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
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
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    taskTextContainerChild: {
        paddingHorizontal: 8,
        paddingVertical: 2,
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
        borderColor: '#2196F3',
        borderRadius: 4,
        padding: 6,
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
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
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
        borderRadius: 4,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    selectButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    selectButtonSelected: {
        backgroundColor: '#2196F3',
        shadowColor: '#2196F3',
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectButtonTextSelected: {
        fontSize: 14,
        color: '#fff',
    },
    editButton: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
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
        borderRadius: 4,
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
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
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
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    childTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingVertical: 8,
        paddingHorizontal: 12,
        paddingRight: 36, // ドラッグハンドル用の余白
        borderRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
        minHeight: 42,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    childTaskItemDeleteMode: {
        backgroundColor: '#FFF8E1',
        borderLeftColor: '#FF9800',
    },
    childTaskItemActive: {
        backgroundColor: '#E8F5E8',
        borderLeftColor: '#4CAF50',
    },
    // 子タスクのドラッグハンドル
    childDragHandle: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 28,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
    },
    childDragHandleText: {
        color: '#4CAF50',
        fontSize: 12,
    },
    // 右スワイプアクション（親タスク化）
    promoteAction: {
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginTop: 3,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        paddingHorizontal: 10,
    },
    promoteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    promoteActionIcon: {
        fontSize: 16,
        marginTop: 2,
    },
    // 左スワイプアクション（子タスク化）
    demoteAction: {
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginBottom: 4,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingHorizontal: 10,
    },
    demoteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    demoteActionIcon: {
        fontSize: 16,
        marginTop: 2,
    },
    // 選択中の親情報
    selectedParentInfo: {
        backgroundColor: '#E8F5E8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    selectedParentText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        flex: 1,
    },
    clearSelectionButton: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    clearSelectionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    // フローティングボタン群
    // 追加ボタン（+）
    floatingAddButton: {
        position: 'absolute',
        bottom: 100, // 削除ボタンの上に配置
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    floatingAddButtonText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '300',
    },

    // 削除ボタン（🗑）
    floatingDeleteButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    floatingDeleteButtonActive: {
        backgroundColor: '#fff',
        shadowColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    floatingDeleteButtonText: {
        fontSize: 20,
        color: '#FF5722',
    },
    floatingDeleteButtonTextActive: {
        fontSize: 24,
        color: '#4CAF50',
    },
});