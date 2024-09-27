import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import {AntDesign} from "@expo/vector-icons";

const defaultTagColor = '#7e7e7e';

interface TagProps {
    tag: Tag;
    isRemovable?: boolean;
    onRemove?: (tagId: number) => void;
}

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TagItem: React.FC<TagProps> = ({ tag, isRemovable = true, onRemove }) => {
    return (
        <StyledView className="flex-row items-center px-2 py-1 rounded-xl mr-2 mb-2" style={{ backgroundColor: tag.color || defaultTagColor }}>
            <StyledText className="text-xs text-white">{tag.name}</StyledText>
            {isRemovable && (
                <StyledTouchableOpacity onPress={() => onRemove?.(tag.id)} className='pl-1'>
                    <AntDesign name="close" size={18} color="white" />
                </StyledTouchableOpacity>
            )}
        </StyledView>
    );
};

export default TagItem;
