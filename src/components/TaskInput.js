import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/styles';

const TaskInput = ({
    inputText,
    onChangeText,
    onSubmit,
    placeholder,
    disabled = false
}) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[
                    styles.input,
                    disabled && { backgroundColor: '#f5f5f5', color: '#999' }
                ]}
                placeholder={disabled ? "削除モード中は入力できません" : placeholder}
                value={inputText}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                editable={!disabled}
            />
            <TouchableOpacity
                style={[styles.addButton, disabled && styles.addButtonDisabled]}
                onPress={onSubmit}
                disabled={disabled}
            >
                <Text style={styles.addButtonText}>
                    追加
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TaskInput;