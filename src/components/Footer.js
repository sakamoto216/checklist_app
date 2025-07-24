import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

const Footer = ({ isDeleteMode, onAddTask, onToggleDeleteMode }) => {
    return (
        <View style={styles.footer}>
            {/* 追加ボタン（左半分） */}
            <TouchableOpacity
                style={styles.footerAddButton}
                onPress={onAddTask}
                activeOpacity={0.8}
                disabled={isDeleteMode}
            >
                <Text style={styles.footerAddButtonText}>+</Text>
            </TouchableOpacity>

            {/* 削除モード切り替えボタン（右半分） */}
            <TouchableOpacity
                style={[
                    styles.footerDeleteButton,
                    isDeleteMode && styles.footerDeleteButtonActive
                ]}
                onPress={onToggleDeleteMode}
                activeOpacity={0.8}
            >
                <Text style={[
                    styles.footerDeleteButtonText,
                    isDeleteMode && styles.footerDeleteButtonTextActive
                ]}>
                    🗑
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;