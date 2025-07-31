import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    Switch,
    Alert
} from 'react-native';
import { styles } from '../styles/styles';
import Ionicons from '@expo/vector-icons/Ionicons';

// package.jsonからバージョン情報を取得
const packageInfo = require('../../package.json');

const SettingsModal = ({
    visible,
    onClose,
    settings,
    updateSetting,
    resetSettings,
}) => {
    // リセット確認
    const handleReset = () => {
        Alert.alert(
            '設定をリセット',
            'すべての設定をデフォルトに戻します。この操作は取り消せません。',
            [
                { text: 'キャンセル', style: 'cancel' },
                { text: 'リセット', style: 'destructive', onPress: resetSettings }
            ]
        );
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.settingsModalOverlay}>
                <View style={styles.settingsModalSimple}>
                    {/* ヘッダー */}
                    <View style={styles.settingsHeader}>
                        <Text style={styles.settingsTitle}>設定</Text>
                        <TouchableOpacity style={styles.settingsCloseButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* 設定項目 */}
                    <View style={styles.settingsContentSimple}>
                        {/* 完了タスク表示 */}
                        <View style={styles.settingsItem}>
                            <Text style={styles.settingsLabel}>完了タスクを表示</Text>
                            <Switch
                                value={settings.showCompletedTasks}
                                onValueChange={(value) => updateSetting('showCompletedTasks', value)}
                                trackColor={{ false: '#E0E0E0', true: '#DA7B39' }}
                                thumbColor={settings.showCompletedTasks ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        {/* 一括チェック機能 */}
                        <View style={styles.settingsItem}>
                            <Text style={styles.settingsLabel}>一括チェック機能</Text>
                            <Switch
                                value={settings.enableBulkActions}
                                onValueChange={(value) => updateSetting('enableBulkActions', value)}
                                trackColor={{ false: '#E0E0E0', true: '#DA7B39' }}
                                thumbColor={settings.enableBulkActions ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        {/* リセットボタン */}
                        <TouchableOpacity 
                            style={[styles.settingsButton, styles.settingsButtonDanger, { marginTop: 30 }]} 
                            onPress={handleReset}
                        >
                            <Text style={[styles.settingsButtonText, styles.settingsButtonTextDanger]}>
                                設定をリセット
                            </Text>
                        </TouchableOpacity>

                        {/* バージョン情報 */}
                        <View style={styles.versionContainer}>
                            <Text style={styles.versionText}>
                                バージョン {packageInfo.version}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SettingsModal;