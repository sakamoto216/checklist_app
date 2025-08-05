import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    Pressable, 
    Modal, 
    Switch,
    Alert,
    Platform
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
        console.log('📱 SettingsModal: handleReset called');
        
        // Android対応: 少し遅延してからAlertを表示
        const showAlert = () => {
            Alert.alert(
                '設定をリセット',
                'すべての設定をデフォルトに戻します。この操作は取り消せません。',
                [
                    { text: 'キャンセル', style: 'cancel' },
                    { text: 'リセット', style: 'destructive', onPress: resetSettings }
                ],
                { cancelable: true }
            );
        };
        
        if (Platform.OS === 'android') {
            setTimeout(showAlert, 100);
        } else {
            showAlert();
        }
    };

    console.log('📱 SettingsModal: visible =', visible);
    console.log('📱 SettingsModal: settings =', settings);

    if (!visible) return null;

    // Android対応: Modalの代わりに絶対配置のViewを使用
    if (Platform.OS === 'android') {
        return (
            <View style={[
                styles.settingsModalOverlay,
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    elevation: 9999,
                }
            ]}>
                <View style={[
                    styles.settingsModalSimple,
                    {
                        elevation: 10000,
                        zIndex: 10000,
                    }
                ]}>
                    {/* ヘッダー */}
                    <View style={styles.settingsHeader}>
                        <Text style={styles.settingsTitle}>設定</Text>
                        <Pressable 
                            style={({ pressed }) => [
                                styles.settingsCloseButton,
                                pressed && { opacity: 0.7 }
                            ]} 
                            onPress={() => {
                                console.log('📱 SettingsModal: Close button pressed');
                                onClose();
                            }}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </Pressable>
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
                        <Pressable 
                            style={({ pressed }) => [
                                styles.settingsButton, 
                                styles.settingsButtonDanger, 
                                { marginTop: 30 },
                                pressed && { opacity: 0.8 }
                            ]} 
                            onPress={() => {
                                console.log('📱 SettingsModal: Reset button pressed');
                                handleReset();
                            }}
                        >
                            <Text style={[styles.settingsButtonText, styles.settingsButtonTextDanger]}>
                                設定をリセット
                            </Text>
                        </Pressable>

                        {/* バージョン情報 */}
                        <View style={styles.versionContainer}>
                            <Text style={styles.versionText}>
                                バージョン {packageInfo.version}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    // iOS用: 従来のModal使用
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
            hardwareAccelerated={true}
            supportedOrientations={['portrait']}
        >
            <View style={styles.settingsModalOverlay}>
                <View style={styles.settingsModalSimple}>
                    {/* ヘッダー */}
                    <View style={styles.settingsHeader}>
                        <Text style={styles.settingsTitle}>設定</Text>
                        <Pressable 
                            style={({ pressed }) => [
                                styles.settingsCloseButton,
                                pressed && { opacity: 0.7 }
                            ]} 
                            onPress={() => {
                                console.log('📱 SettingsModal: Close button pressed');
                                onClose();
                            }}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </Pressable>
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
                        <Pressable 
                            style={({ pressed }) => [
                                styles.settingsButton, 
                                styles.settingsButtonDanger, 
                                { marginTop: 30 },
                                pressed && { opacity: 0.8 }
                            ]} 
                            onPress={() => {
                                console.log('📱 SettingsModal: Reset button pressed');
                                handleReset();
                            }}
                        >
                            <Text style={[styles.settingsButtonText, styles.settingsButtonTextDanger]}>
                                設定をリセット
                            </Text>
                        </Pressable>

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