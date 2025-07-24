import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import AntDesign from '@expo/vector-icons/AntDesign';


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
                <AntDesign style={styles.footerAddButtonText} name="plus" />
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

                <AntDesign style={[
                    styles.footerDeleteButtonText,
                    isDeleteMode && styles.footerDeleteButtonTextActive
                ]}
                    name="delete" />
            </TouchableOpacity>
        </View>
    );
};

export default Footer;