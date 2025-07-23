import React from 'react';
import { View } from 'react-native';
import {
    PanGestureHandler,
    State,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import ParentTaskItem from './ParentTaskItem';

const DraggableParentTaskItem = ({
    item,
    index,
    onDragStart,
    onDragEnd,
    onDragOver,
    isDragging,
    isDropTarget,
    ...otherProps
}) => {
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startY = translateY.value;
            scale.value = withSpring(1.05);
            runOnJS(onDragStart)(item.id, index);
        },
        onActive: (event, context) => {
            translateY.value = context.startY + event.translationY;

            // ドロップターゲットの計算（80pxは1アイテムの高さの目安）
            const targetIndex = Math.max(0, Math.min(
                10, // 仮の最大インデックス（実際のタスク数に応じて調整）
                Math.round((event.translationY + index * 80) / 80)
            ));
            runOnJS(onDragOver)(targetIndex);
        },
        onEnd: () => {
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
            runOnJS(onDragEnd)();
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { scale: scale.value }
            ],
            zIndex: isDragging ? 1000 : 1,
            elevation: isDragging ? 8 : 2,
            opacity: isDragging ? 0.9 : 1,
        };
    });

    return (
        <View>
            {/* ドロップターゲット表示 */}
            {isDropTarget && (
                <View style={{
                    height: 4,
                    backgroundColor: '#2196F3',
                    marginVertical: 8,
                    borderRadius: 2,
                    marginHorizontal: 16,
                }} />
            )}

            <PanGestureHandler
                onGestureEvent={gestureHandler}
                onHandlerStateChange={gestureHandler}
                minDist={10} // 10px移動してからドラッグ開始
            >
                <Animated.View style={animatedStyle}>
                    <ParentTaskItem
                        item={item}
                        index={index}
                        {...otherProps}
                    />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

export default DraggableParentTaskItem;