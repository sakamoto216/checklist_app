import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/styles';

const DropZone = ({
    isDragging,
    index,
    onDrop,
    type = 'between', // 'between' or 'final'
    label
}) => {
    if (!isDragging) return null;

    const dropZoneStyle = type === 'final' ? styles.dropZoneFinal : styles.dropZoneBetween;
    const dropZoneLabel = label || (type === 'final' ? '最後に移動' : 'ここに移動');

    return (
        <TouchableOpacity
            key={type === 'final' ? 'drop-final' : `drop-${index}`}
            style={dropZoneStyle}
            onPress={onDrop}
            activeOpacity={0.7}
        >
            <Text style={styles.dropZoneLabel}>{dropZoneLabel}</Text>
        </TouchableOpacity>
    );
};

export default DropZone;