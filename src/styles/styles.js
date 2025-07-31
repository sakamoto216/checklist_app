import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // メインコンテナ
    container: {
        flex: 1,
        backgroundColor: '#aaaaaa', // 元のグレーに戻す
        paddingTop: 10, // StatusBar分を調整
        paddingHorizontal: 15,
        // 震え防止（translateZ削除）
        backfaceVisibility: 'hidden',
    },

    // 入力エリア
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

    // タスクリスト
    taskList: {
        flex: 1,
    },
    taskListContent: {
        paddingBottom: 70, // フラットフッター分の余白に調整
    },
    taskContainer: {
        marginBottom: 2,
        backgroundColor: '#DA7B39',
        borderRadius: 6,
    },
    taskContainerActive: {
        backgroundColor: 'rgba(218, 123, 57, 0.15)', // より濃いオレンジアクセント
        borderWidth: 3, // より太いボーダー
        borderColor: '#DA7B39', // オレンジアクセント
        shadowColor: '#DA7B39',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8, // Android用の影
        transform: [{ scale: 1.02 }], // わずかに拡大
    },
    taskContainerDeleteMode: {
        backgroundColor: 'rgba(255, 87, 34, 0.05)',
    },

    // 編集コンテナ（追加）
    editContainer: {
        flex: 1,
    },

    // 親タスク（ドラッグハンドル分の余白を統一）
    parentTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 40, // 子タスクと統一
        paddingVertical: 6,
        borderLeftWidth: 4,
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
        fontSize: 14,
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

    // ドラッグハンドル（親タスク）
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
        marginLeft: 15,
    },
    childTaskContainer: {
        marginTop: 2,
    },
    childTaskContainerActive: {
        backgroundColor: 'rgba(218, 123, 57, 0.15)', // より濃いオレンジアクセント
        borderWidth: 3, // より太いボーダー
        borderColor: '#DA7B39', // オレンジアクセント
        shadowColor: '#DA7B39',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 6, // Android用の影
        transform: [{ scale: 1.01 }], // わずかに拡大
    },
    childTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 6,
        paddingHorizontal: 10,
        paddingRight: 40, // 親タスクと統一
        minHeight: 42,
    },
    childTaskItemDeleteMode: {
        backgroundColor: '#FFF8E1',
        borderLeftColor: '#FF9800',
    },
    childTaskItemActive: {
        backgroundColor: '#FDF5F1', // 薄いオレンジ背景
        borderLeftColor: '#DA7B39', // オレンジアクセント
        borderLeftWidth: 4, // より太いボーダー
    },

    // 子タスクのドラッグハンドル（親と位置合わせ）
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
        fontSize: 14,
    },

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
        backgroundColor: '#fff', // より薄いグレー
        paddingVertical: 6,
        paddingHorizontal: 10,
        paddingRight: 40, // 親・子タスクと統一
        minHeight: 36, // 子タスクより小さく
    },
    grandchildTaskItemDeleteMode: {
        backgroundColor: '#FFF9C4',
        borderLeftColor: '#FFB300',
    },
    grandchildTaskItemActive: {
        backgroundColor: '#FFF3E0',
        borderLeftColor: '#FFA726',
        borderLeftWidth: 4, // より太いボーダー
    },

    // 孫タスクのチェックボックス
    checkboxGrandchild: {
        width: 24, // 子タスクより小さく
        height: 24,
    },
    checkboxTextGrandchild: {
        fontSize: 14, // 少し小さく
    },

    // 孫タスクのテキスト
    taskTextContainerGrandchild: {
        flex: 1,
        marginLeft: 8,
    },
    taskTextGrandchild: {
        fontSize: 15, // すべて15
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

    // 孫タスクのドラッグハンドル（幅を調整）
    grandchildDragHandle: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 32, // 親・子と同じ幅に統一
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    grandchildDragHandleText: {
        color: '#757575',
        fontSize: 14, // 少し小さく
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
        color: '#fff',
    },

    // 左スワイプアクション（子タスク化）
    demoteAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        marginTop: 3,
        paddingHorizontal: 10,
    },
    demoteActionIcon: {
        fontSize: 20,
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

    // フラットフッターエリア（新デザイン）
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

    // フッター追加ボタン（中央 - オレンジ）
    footerAddButton: {
        flex: 3, // さらに幅を広く
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DA7B39', // オレンジアクセント
        height: 70,
        marginHorizontal: 2, // 左右に2pxのマージン
    },
    footerAddButtonText: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '400',
    },

    // フッター共通ボタン（白背景）
    footerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 70,
    },
    footerButtonText: {
        fontSize: 22,
        color: '#DA7B39', // オレンジアイコン
        fontWeight: '500',
    },

    // アクティブ状態（削除モード時）
    footerButtonActive: {
        backgroundColor: '#FF5722',
    },
    footerButtonTextActive: {
        color: '#fff',
    },

    // 無効化状態のスタイル
    footerButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    footerButtonTextDisabled: {
        color: '#9E9E9E',
    },

    // 両端ボタン用マージン
    footerButtonLeft: {
        marginLeft: 2, // 左端ボタンを内側に
    },
    footerButtonRight: {
        marginRight: 2, // 右端ボタンを内側に
    },

    // タブバー関連スタイル
    tabBarContainer: {
        backgroundColor: '#aaaaaa', // 元のグレーに戻す
        borderBottomWidth: 4, // 4pxのボーダーを追加
        borderBottomColor: '#777777', // 濃い目のグレーのボーダー
        paddingTop: 8,
        paddingBottom: 0,
        elevation: 0,
        shadowOpacity: 0,
        zIndex: 100,
        marginHorizontal: -15, // コンテナのpaddingを相殺
    },
    tabBarScrollContent: {
        paddingLeft: 15, // リストの左端に合わせる
        paddingRight: 15,
        alignItems: 'flex-end',
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 4,
        backgroundColor: '#999999', // オフのタブはグレー
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomWidth: 0,
        minWidth: 100,
        maxWidth: 150,
        position: 'relative',
        height: 40, // 高さを固定
    },
    activeTab: {
        backgroundColor: '#777777', // アクティブタブは濃い目のグレー
        elevation: 2, // Android用の影
        shadowColor: '#000', // iOS用の影
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 120,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    tabDeleteButton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8, // タブ名との隙間
    },
    tabDeleteButtonText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 10,
    },
    tabEditInput: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 60,
    },
    addTab: {
        paddingHorizontal: 16,
        backgroundColor: '#999999',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        minWidth: 50,
        height: 40, // 他のタブと同じ高さに固定
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4, // 他のタブと同じマージン
    },
    addTabText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },

    // 設定モーダル関連
    settingsModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsModalContainer: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingsModalSimple: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 0,
        maxHeight: '60%',
    },
    settingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#f8f8f8',
    },
    settingsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    settingsCloseButton: {
        padding: 4,
    },
    settingsContent: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
    },
    settingsContentSimple: {
        padding: 20,
        flexDirection: 'column',
    },
    settingsSidebar: {
        width: 120,
        backgroundColor: '#f8f8f8',
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sidebarItemActive: {
        backgroundColor: '#FFF3E0',
        borderRightWidth: 3,
        borderRightColor: '#DA7B39',
    },
    sidebarItemText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
        fontWeight: '500',
    },
    sidebarItemTextActive: {
        color: '#DA7B39',
        fontWeight: '600',
    },
    settingsMain: {
        flex: 1,
        padding: 20,
    },
    settingsSection: {
        marginBottom: 30,
    },
    settingsSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingsLabel: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    settingsPicker: {
        width: 120,
    },
    picker: {
        height: 40,
        width: 120,
    },
    slider: {
        width: 150,
        height: 40,
    },
    settingsButton: {
        backgroundColor: '#DA7B39',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    settingsButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    settingsButtonDanger: {
        backgroundColor: '#FF5722',
    },
    settingsButtonTextDanger: {
        color: 'white',
    },

    // 設定項目のボタングループ
    settingsButtonGroup: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 2,
    },
    settingsOption: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    settingsOptionActive: {
        backgroundColor: '#DA7B39',
    },
    settingsOptionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    settingsOptionTextActive: {
        color: 'white',
        fontWeight: '600',
    },

    // カウンター
    settingsCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 2,
    },
    counterButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#DA7B39',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600',
    },
    counterValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        minWidth: 60,
        textAlign: 'center',
        marginHorizontal: 8,
    },

    // バージョン情報
    versionContainer: {
        paddingTop: 30,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});