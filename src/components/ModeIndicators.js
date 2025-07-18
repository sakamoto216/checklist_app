import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

const ModeIndicators = ({
    selectedParentId,
    selectedParentName,
    onCancelParentSelection,
    editingId,
    isDragging,
    isChildDrag,
    onCancelDrag
}) => {
    return (
        <>
            {/* 親選択モード表示 */}
            {selectedParentId && (
                <View style={styles.modeIndicator}>
                    <Text style={styles.modeText}>
                        アイテム追加モード: {selectedParentName}
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
                    <Text style={styles.editModeText}>
                        編集モード: アイテム名を変更しています
                    </Text>
                </View>
            )}

            {/* ドラッグモード表示 */}
            {isDragging && (
                <View style={styles.dragModeIndicator}>
                    <Text style={styles.dragModeText}>
                        {isChildDrag
                            ? '子アイテムを移動中 - 点線エリアをタップして移動'
                            : '親アイテムを移動中 - 点線エリア:順序変更 / 子に移動ボタン:子に変更'
                        }
                    </Text>
                    <TouchableOpacity
                        style={styles.cancelDragButton}
                        onPress={onCancelDrag}
                    >
                        <Text style={styles.cancelDragText}>キャンセル</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};

export default ModeIndicators;