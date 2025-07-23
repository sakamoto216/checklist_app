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
    // タスクコンテナ
    taskList: {
        flex: 1,
    },
    taskListContent: {
        paddingBottom: 20,
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
    // 親タスク
    parentTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
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
    // チェックボックス
    checkboxContainer: {
        padding: 4,
    },
    checkboxContainerChild: {
        padding: 3,
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
        paddingHorizontal: 6,
    },
    taskTextTouchable: {
        flex: 1,
        paddingVertical: 2,
    },
    taskTextTouchableChild: {
        paddingVertical: 1,
    },
    taskText: {
        fontSize: 14,
        color: '#333',
    },
    taskTextChild: {
        fontSize: 12,
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
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
        marginRight: 4,
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
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 3,
    },
    selectButtonSelected: {
        backgroundColor: '#2196F3',
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    selectButtonTextSelected: {
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
        marginTop: 4,
        marginLeft: 20,
        marginRight: 36,
    },
    childTaskContainer: {
        marginTop: 3,
    },
    childTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        borderLeftWidth: 6,
        borderLeftColor: '#4CAF50',
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
});