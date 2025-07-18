import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

const ModeIndicators = ({
    selectedParentId,
    selectedParentName,
    onCancelParentSelection,
    editingId,
    editingText,
    tasks,
    onCancelEditing,
    isDragging,
    isChildDrag,
    onCancelDrag
}) => {

    // 編集中のアイテムの元の名前を取得
    const getEditingItemName = () => {
        if (!editingId || !tasks) return '';

        // 親アイテムから検索
        for (const task of tasks) {
            if (task.id === editingId) {
                return task.text;
            }
            // 子アイテムから検索
            for (const child of task.children) {
                if (child.id === editingId) {
                    return child.text;
                }
            }
        }
        return '';
    };

    return (
        <>
            {/* 親選択モード表示 */}
            {selectedParentId && (
                <View style={styles.modeIndicator}>
                    <Text style={[styles.modeText, { flex: 1, flexWrap: 'wrap' }]} numberOfLines={2}>
                        {selectedParentName}へ子を追加
                    </Text>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancelParentSelection}
                    >
                        <Text style={styles.cancelModeText}>×</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 編集モード表示 */}
            {editingId && (
                <View style={styles.editModeIndicator}>
                    <Text style={[styles.editModeText, { flex: 1, flexWrap: 'wrap' }]} numberOfLines={2}>
                        {getEditingItemName()}の編集
                    </Text>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancelEditing}
                    >
                        <Text style={styles.cancelModeText}>×</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ドラッグモード表示 */}
            {isDragging && (
                <View style={styles.dragModeIndicator}>
                    <Text style={[styles.dragModeText, { flex: 1, flexWrap: 'wrap' }]}>
                        タップで点線で囲われた箇所に移動
                    </Text>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancelDrag}
                    >
                        <Text style={styles.cancelModeText}>×</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};

export default ModeIndicators;