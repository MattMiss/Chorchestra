import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
//import { styled } from 'nativewind';
import { Tag } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { getContrastingTextColor } from '@/utils/helpers';
import {Colors} from "@/constants/Colors";

interface TagProps {
    tag: Tag;
    isAvailable?: boolean;
    textSize?: 'text-xs' | 'text-md' | 'text-lg';
    iconSize?: number;
    isRemovable?: boolean;
    onRemove?: (tagId: number) => void;
}

// Reusable styled components
// const Text = styled(Text);
// const View = styled(View);
// const TouchableOpacity = styled(TouchableOpacity);

const TagItem: React.FC<TagProps> = ({
                                         tag,
                                         isAvailable = true,
                                         textSize,
                                         isRemovable = true,
                                         onRemove,
                                     }) => {
    // Determine text color based on background color
    const textColor = getContrastingTextColor(tag.color || Colors.defaultTagColor); // Default to white if no color

    return (
        <View className="flex-row items-center relative mr-2">
            {/* Tag content */}
            <View
                className={`flex-row items-center px-3 py-1 rounded-full ${!isAvailable ? 'opacity-50' : ''}`}
                style={{ backgroundColor: tag.color || Colors.defaultTagColor }}
            >
                <Text
                    className={`${textSize || 'text-xs'} ${!isAvailable && 'line-through'} text-primary`}
                    style={{ color: textColor }}
                >
                    {tag.name}
                </Text>
            </View>

            {/* Removable 'X' icon, positioned over the top-right corner */}
            {isRemovable && (
                <TouchableOpacity
                    onPress={() => onRemove?.(tag.id)}
                    className="absolute -top-3 -right-3"
                >
                    <View className="rounded-full">
                        <AntDesign name="close" size={20} color="red" />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default TagItem;
