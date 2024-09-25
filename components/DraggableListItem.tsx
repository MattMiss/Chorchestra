import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    SharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { styled } from 'nativewind';
import ListItem from './ListItem';

const AnimatedView = Animated.createAnimatedComponent(styled(View));

export interface ItemData {
    id: string;
    text: string;
}

interface DraggableListItemProps {
    item: ItemData;
    index: number;
    positions: SharedValue<number[]>;
    ITEM_HEIGHT: number;
    dataLength: number;
    scrollY: SharedValue<number>;
    swapItems: (from: number, to: number) => void;
    onDelete: () => void;
}

type ContextType = {
    startY: number;
    activeIndex: number;
    currentY: number;
};

const DraggableListItem: React.FC<DraggableListItemProps> = ({
                                                                 item,
                                                                 index,
                                                                 positions,
                                                                 ITEM_HEIGHT,
                                                                 dataLength,
                                                                 scrollY,
                                                                 swapItems,
                                                                 onDelete,
                                                             }) => {
    const gestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        ContextType
    >({
        onStart: (event, context) => {
            context.startY = event.absoluteY + scrollY.value;
            context.currentY = context.startY;
            context.activeIndex = positions.value[index];
        },
        onActive: (event, context) => {
            context.currentY = context.startY + event.translationY;
            const newIndex = Math.floor((context.currentY + scrollY.value) / ITEM_HEIGHT);
            if (
                newIndex !== context.activeIndex &&
                newIndex >= 0 &&
                newIndex < dataLength
            ) {
                swapItems(context.activeIndex, newIndex);
                context.activeIndex = newIndex;
            }
        },
        onEnd: () => {},
    });

    const animatedStyle = useAnimatedStyle(() => {
        const positionIndex = positions.value[index];

        if (positionIndex === undefined) {
            console.error(`positions.value[${index}] is undefined`);
        } else {
            console.log(`positions.value[${item.id}] = ${positionIndex}`);
        }

        const position = positionIndex * ITEM_HEIGHT;

        if (isNaN(position)) {
            console.error(`Calculated position for item ${item.id} is NaN`);
        }

        return {
            transform: [{ translateY: withSpring(position) }],
        };
    });


    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <AnimatedView style={[styles.itemContainer, animatedStyle]}>
                <ListItem
                    index={positions.value[index]}
                    text={item.text}
                    onDelete={onDelete}
                />
            </AnimatedView>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        height: 60, // Ensure this matches ITEM_HEIGHT
        width: '100%',
        position: 'absolute',
        left: 0,
    },
});

export default DraggableListItem;
