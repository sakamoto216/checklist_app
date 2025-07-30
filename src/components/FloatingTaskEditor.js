import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { styles } from '../styles/styles';

const FloatingTaskEditor = ({
    visible,
    task,
    editingText,
    setEditingText,
    onSaveEdit,
    onCancelEditing,
    keyboardHeight,
    level = 0, // 0: 親, 1: 子, 2: 孫
}) => {
    if (!visible || !task) return null;

    // 画面サイズを取得
    const screenHeight = Dimensions.get('window').height;

    // プラットフォーム別の推定キーボード高さ
    const getEstimatedKeyboardHeight = () => {
        if (Platform.OS === 'ios') {
            // iOSの一般的なキーボード高さ
            return screenHeight > 667 ? 346 : 258; // iPhone X系 vs 従来のiPhone
        } else {
            // Androidの一般的なキーボード高さ（画面高さの約35-40%）
            return Math.floor(screenHeight * 0.4);
        }
    };

    // キーボードの上に配置（より適切な初期位置設定）
    const modalBottom = keyboardHeight > 0 
        ? keyboardHeight + 20 // 実際のキーボードの20px上
        : getEstimatedKeyboardHeight() + 20; // 推定キーボードの20px上

    // レベルに応じたプレースホルダー
    const getPlaceholder = () => {
        if (level === 2) return '孫タスク名を入力...';
        if (level === 1) return '子タスク名を入力...';
        return 'タスク名を入力...';
    };

    // レベルに応じたタイトル
    const getTitle = () => {
        if (level === 2) return '孫タスク';
        if (level === 1) return '子タスク';
        return 'タスク';
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onCancelEditing}
        >
            {/* 薄く暗転した背景オーバーレイ */}
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                justifyContent: 'flex-end',
            }}>
                {/* フローティングエディター */}
                <View style={{
                    position: 'absolute',
                    bottom: modalBottom,
                    left: 20,
                    right: 20,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    elevation: 10,
                }}>
                    {/* ヘッダー */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: '#333',
                        }}>
                            {getTitle()}を編集
                        </Text>
                        <TouchableOpacity
                            onPress={onCancelEditing}
                            style={{
                                padding: 4,
                                borderRadius: 12,
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#666',
                                lineHeight: 20,
                                textAlign: 'center',
                                width: 20,
                            }}>
                                ×
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* タスク情報表示 */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}>
                        {/* チェックボックス */}
                        <View style={[
                            {
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 2,
                                borderColor: task.completed ? '#4CAF50' : '#ddd',
                                backgroundColor: task.completed ? '#4CAF50' : 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }
                        ]}>
                            {task.completed && (
                                <Text style={{
                                    color: 'white',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                }}>
                                    ✓
                                </Text>
                            )}
                        </View>

                        {/* レベル表示 */}
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 8,
                            backgroundColor: level === 2 ? '#FFF3E0' : level === 1 ? '#E8F5E8' : '#E3F2FD',
                        }}>
                            <Text style={{
                                fontSize: 12,
                                color: level === 2 ? '#F57C00' : level === 1 ? '#4CAF50' : '#2196F3',
                                fontWeight: '500',
                            }}>
                                {getTitle()}
                            </Text>
                        </View>
                    </View>

                    {/* テキスト入力 */}
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            fontSize: 16,
                            backgroundColor: '#fafafa',
                            marginBottom: 20,
                            minHeight: 48,
                        }}
                        value={editingText}
                        onChangeText={setEditingText}
                        onSubmitEditing={onSaveEdit}
                        autoFocus
                        placeholder={getPlaceholder()}
                        placeholderTextColor="#999"
                        multiline={false}
                        selectTextOnFocus={true}
                    />

                    {/* アクションボタン */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: 12,
                    }}>
                        <TouchableOpacity
                            onPress={onCancelEditing}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 8,
                                backgroundColor: '#f5f5f5',
                                minWidth: 80,
                            }}
                        >
                            <Text style={{
                                color: '#666',
                                fontSize: 16,
                                fontWeight: '500',
                                textAlign: 'center',
                            }}>
                                キャンセル
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSaveEdit}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 8,
                                backgroundColor: '#2196F3',
                                minWidth: 80,
                            }}
                        >
                            <Text style={{
                                color: 'white',
                                fontSize: 16,
                                fontWeight: '600',
                                textAlign: 'center',
                            }}>
                                保存
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 背景タップでキャンセル */}
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                    }}
                    onPress={onCancelEditing}
                    activeOpacity={1}
                />
            </View>
        </Modal>
    );
};

export default FloatingTaskEditor;