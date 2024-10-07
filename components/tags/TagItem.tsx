import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { getContrastingTextColor } from '@/utils/helpers';

const defaultTagColor = '#7e7e7e';

interface TagProps {
    tag: Tag;
    isAvailable?: boolean;
    textSize?: 'text-xs' | 'text-md' | 'text-lg';
    iconSize?: number;
    isRemovable?: boolean;
    onRemove?: (tagId: number) => void;
}

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TagItem: React.FC<TagProps> = ({
                                         tag,
                                         isAvailable = true,
                                         textSize,
                                         iconSize,
                                         isRemovable = true,
                                         onRemove,
                                     }) => {
    // Determine text color based on background color
    const textColor = getContrastingTextColor(tag.color || '#7e7e7e'); // Default to white if no color

    return (
        <StyledView className="flex-row items-center relative mr-2">
            {/* Tag content */}
            <StyledView
                className={`flex-row items-center px-3 py-1 rounded-full ${!isAvailable ? 'opacity-50' : ''}`}
                style={{ backgroundColor: tag.color || defaultTagColor }}
            >
                <StyledText
                    className={`${textSize || 'text-xs'} ${!isAvailable && 'line-through'} text-white`}
                    style={{ color: textColor }}
                >
                    {tag.name}
                </StyledText>
            </StyledView>

            {/* Removable 'X' icon, positioned over the top-right corner */}
            {isRemovable && (
                <StyledTouchableOpacity
                    onPress={() => onRemove?.(tag.id)}
                    className="absolute -top-3 -right-3"
                >
                    <StyledView className="bg-white rounded-full">
                        <AntDesign name="close" size={20} color="orange" />
                    </StyledView>
                </StyledTouchableOpacity>
            )}
        </StyledView>
    );
};

export default TagItem;
