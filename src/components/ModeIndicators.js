import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { styles } from '../styles/styles';

const ModeIndicators = ({
    selectedParentId,
    selectedParentName,
    onCancelParentSelection,
    editingId,
    editingItemName,
    onCancelEditing,
    isDragging,
    isChildDrag,
    onCancelDrag
}) => {
    return (
        <>
            {/* 親選択モード表示 */}
            {selectedParentId && (
                <View style={styles.modeIndicator}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={[styles.modeText, {
                            flexWrap: 'wrap',
                            ...(Platform.OS === 'android' && { textAlignVertical: 'center' })
                        }]}>
                            {selectedParentName}へ子を追加
                        </Text>
                    </View>
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
                <View style={[styles.editModeIndicator, { minHeight: 50 }]}>
                    <View style={{
                        flex: 1,
                        paddingRight: 8,
                        justifyContent: 'center',
                        minHeight: 40
                    }}>
                        <Text
                            style={{
                                color: '#1976D2',
                                fontWeight: 'bold',
                                fontSize: 16,
                                fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
                                includeFontPadding: false,
                                textAlignVertical: 'center',
                                lineHeight: 20,
                                letterSpacing: 0,
                                writingDirection: 'ltr',
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {editingItemName ? `${editingItemName}の編集` : 'アイテムの編集'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancelEditing}
                    >
                        <Text style={{
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            includeFontPadding: false,
                            textAlignVertical: 'center'
                        }}>×</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ドラッグモード表示 */}
            {isDragging && (
                <View style={styles.dragModeIndicator}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={[styles.dragModeText, {
                            flexWrap: 'wrap',
                            ...(Platform.OS === 'android' && { textAlignVertical: 'center' })
                        }]}>
                            タップで点線で囲われた箇所に移動
                        </Text>
                    </View>
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