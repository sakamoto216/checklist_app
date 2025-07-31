import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
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
        Alert.alert(
            '全件チェック',
            '表示中のすべてのタスクをチェック済みにします。よろしいですか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                { text: 'チェック', style: 'default', onPress: onCheckAllTasks }
            ]
        );
    };

    // 全件チェック解除確認ダイアログ
    const handleUncheckAllConfirm = () => {
        Alert.alert(
            '全件チェック解除',
            '表示中のすべてのタスクのチェックを外します。よろしいですか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                { text: 'チェック解除', style: 'default', onPress: onUncheckAllTasks }
            ]
        );
    };

    return (
        <View style={styles.footer}>
            {/* 全件チェックボタン（1/5） */}
            <TouchableOpacity
                style={[
                    styles.footerButton,
                    styles.footerButtonLeft,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonDisabled
                ]}
                onPress={handleCheckAllConfirm}
                activeOpacity={0.8}
                disabled={isDeleteMode || !hasTasksToCheck || !enableBulkActions}
            >
                <Feather style={[
                    styles.footerButtonText,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonTextDisabled
                ]} name="check-square" />
            </TouchableOpacity>

            {/* 全件チェック解除ボタン（2/5） */}
            <TouchableOpacity
                style={[
                    styles.footerButton,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonDisabled
                ]}
                onPress={handleUncheckAllConfirm}
                activeOpacity={0.8}
                disabled={isDeleteMode || !hasTasksToCheck || !enableBulkActions}
            >
                <Feather style={[
                    styles.footerButtonText,
                    (isDeleteMode || !hasTasksToCheck || !enableBulkActions) && styles.footerButtonTextDisabled
                ]} name="square" />
            </TouchableOpacity>

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
            <TouchableOpacity
                style={[
                    styles.footerButton,
                    styles.footerButtonRight,
                    isDeleteMode && styles.footerButtonDisabled
                ]}
                onPress={onOpenSettings}
                activeOpacity={0.8}
                disabled={isDeleteMode}
            >
                <Ionicons style={[
                    styles.footerButtonText,
                    isDeleteMode && styles.footerButtonTextDisabled
                ]} name="settings-outline" />
            </TouchableOpacity>
        </View>
    );
};

export default Footer;