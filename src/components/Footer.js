import React from 'react';
import { View, Text, TouchableOpacity, Pressable, Alert, Platform } from 'react-native';
import { styles } from '../styles/styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';


const Footer = ({
    isDeleteMode,
    onAddTask,
    onToggleDeleteMode,
    onCheckAllTasks,
    onUncheckAllTasks,
    onOpenSettings,
    hasTasksToCheck = false,
    enableBulkActions = true
}) => {
    // 全件チェック確認ダイアログ
    const handleCheckAllConfirm = () => {
        console.log('📱 Footer: handleCheckAllConfirm called');
        console.log('📱 Footer: onCheckAllTasks exists:', !!onCheckAllTasks);
        
        // Android対応: 少し遅延してからAlertを表示
        const showAlert = () => {
            Alert.alert(
                '全件チェック',
                '表示中のすべてのタスクをチェック済みにします。よろしいですか？',
                [
                    { text: 'キャンセル', style: 'cancel' },
                    { text: 'チェック', style: 'default', onPress: onCheckAllTasks }
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

    // 全件チェック解除確認ダイアログ
    const handleUncheckAllConfirm = () => {
        console.log('📱 Footer: handleUncheckAllConfirm called');
        console.log('📱 Footer: onUncheckAllTasks exists:', !!onUncheckAllTasks);
        
        // Android対応: 少し遅延してからAlertを表示
        const showAlert = () => {
            Alert.alert(
                '全件チェック解除',
                '表示中のすべてのタスクのチェックを外します。よろしいですか？',
                [
                    { text: 'キャンセル', style: 'cancel' },
                    { text: 'チェック解除', style: 'default', onPress: onUncheckAllTasks }
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

    return (
        <View style={styles.footer}>
            {/* 全件チェックボタン（1/5） */}
            <Pressable
                style={({ pressed }) => [
                    styles.footerButton,
                    styles.footerButtonLeft,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonDisabled,
                    pressed && { opacity: 0.8 }
                ]}
                onPress={() => {
                    console.log('📱 Footer: Check all button pressed');
                    console.log('📱 Footer: isDeleteMode:', isDeleteMode);
                    console.log('📱 Footer: hasTasksToCheck:', hasTasksToCheck);
                    console.log('📱 Footer: enableBulkActions:', enableBulkActions);
                    handleCheckAllConfirm();
                }}
                disabled={isDeleteMode || !hasTasksToCheck || !enableBulkActions}
            >
                <Feather style={[
                    styles.footerButtonText,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonTextDisabled
                ]} name="check-square" />
            </Pressable>

            {/* 全件チェック解除ボタン（2/5） */}
            <Pressable
                style={({ pressed }) => [
                    styles.footerButton,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonDisabled,
                    pressed && { opacity: 0.8 }
                ]}
                onPress={() => {
                    console.log('📱 Footer: Uncheck all button pressed');
                    console.log('📱 Footer: isDeleteMode:', isDeleteMode);
                    console.log('📱 Footer: hasTasksToCheck:', hasTasksToCheck);
                    console.log('📱 Footer: enableBulkActions:', enableBulkActions);
                    handleUncheckAllConfirm();
                }}
                disabled={isDeleteMode || !hasTasksToCheck || !enableBulkActions}
            >
                <Feather style={[
                    styles.footerButtonText,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonTextDisabled
                ]} name="square" />
            </Pressable>

            {/* 追加ボタン（3/5 - 中央） */}
            <TouchableOpacity
                style={styles.footerAddButton}
                onPress={onAddTask}
                activeOpacity={0.8}
                disabled={isDeleteMode}
            >
                <AntDesign style={styles.footerAddButtonText} name="plus" />
            </TouchableOpacity>

            {/* 削除モード切り替えボタン（4/5） */}
            <TouchableOpacity
                style={[
                    styles.footerButton,
                    isDeleteMode && styles.footerButtonActive
                ]}
                onPress={onToggleDeleteMode}
                activeOpacity={0.8}
            >
                <AntDesign style={[
                    styles.footerButtonText,
                    isDeleteMode && styles.footerButtonTextActive
                ]}
                    name="delete" />
            </TouchableOpacity>

            {/* 設定ボタン（5/5） */}
            <Pressable
                style={({ pressed }) => [
                    styles.footerButton,
                    styles.footerButtonRight,
                    isDeleteMode && styles.footerButtonDisabled,
                    pressed && { opacity: 0.8 }
                ]}
                onPress={() => {
                    console.log('📱 Footer: Settings button pressed');
                    console.log('📱 Footer: onOpenSettings exists:', !!onOpenSettings);
                    console.log('📱 Footer: isDeleteMode:', isDeleteMode);
                    onOpenSettings && onOpenSettings();
                }}
                disabled={isDeleteMode}
            >
                <Ionicons style={[
                    styles.footerButtonText,
                    isDeleteMode && styles.footerButtonTextDisabled
                ]} name="settings-outline" />
            </Pressable>
        </View>
    );
};

export default Footer;