import React from 'react';
import { View } from 'react-native';
import {
    PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import ParentTaskItem from './ParentTaskItem';

const SimpleDraggableItem = ({
    item,
    index,
    onDrag,
    isDragging,
    ...otherProps
}) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: () => {
            opacity.value = withTiming(0.7, { duration: 150 });
        },
        onActive: (event) => {
            translateY.value = event.translationY;

            // ドラッグ情報を親に送信
            runOnJS(onDrag)({
                draggedIndex: index,
                translationY: event.translationY,
                isDragging: true
            });
        },
        onEnd: () => {
            translateY.value = withSpring(0);
            opacity.value = withTiming(1, { duration: 150 });

            // ドラッグ終了を親に送信
            runOnJS(onDrag)({
                draggedIndex: index,
                translationY: 0,
                isDragging: false,
                isEnd: true
            });
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: isDragging ? translateY.value : 0 }],
            opacity: opacity.value,
            zIndex: isDragging ? 1000 : 1,
            elevation: isDragging ? 8 : 2,
        };
    });

    return (
        <PanGestureHandler
            onGestureEvent={gestureHandler}
            onHandlerStateChange={gestureHandler}
            activeOffsetY={[-15, 15]}
        >
            <Animated.View style={animatedStyle}>
                <ParentTaskItem
                    item={item}
                    index={index}
                    {...otherProps}
                />
            </Animated.View>
        </PanGestureHandler>
    );
};

export default SimpleDraggableItem;