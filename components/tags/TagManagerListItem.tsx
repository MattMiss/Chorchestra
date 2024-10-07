// src/components/tags/TagListItem.tsx

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Tag } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { styled } from 'nativewind';
import TagItem from './TagItem';

interface TagManagerListItemProps {
    tag: Tag;
    onEdit: (tag: Tag) => void;
    onPickColor: (tag: Tag) => void;
}

interface TagManagerHiddenListItemProps {
    tag: Tag;
    onDelete: (tag: Tag) => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const TagManagerListItem: React.FC<TagManagerListItemProps> = ({ tag, onEdit, onPickColor }) => {
    return (
        <StyledTouchableOpacity
            className={`flex-row justify-between items-center p-4 my-1 rounded-full`}
            onPress={() => onEdit(tag)}
            style={{
                backgroundColor: tag.color
            }}
            activeOpacity={1} // Prevent opacity change on press
        >
            {/* Tag Item */}
            <TagItem tag={tag} isRemovable={false} textSize="text-md" />

            <StyledTouchableOpacity
                className="rounded-lg"
                onPress={() => onPickColor(tag)}
                accessibilityLabel={`Pick color for tag ${tag.name}`}
                activeOpacity={0.7} // Optional: set to desired opacity on press
            >
                <FontAwesome5 name="palette" size={20} color="white" />
            </StyledTouchableOpacity>
        </StyledTouchableOpacity>
    );
};

// Render the hidden delete button
export const TagManagerHiddenListItem: React.FC<TagManagerHiddenListItemProps> = ({ tag, onDelete }) => {
    return (
        <StyledView className="flex-1 flex-row justify-end items-center px-4">
            <StyledTouchableOpacity
                className="w-12 h-12 flex justify-center items-center"
                onPress={() => onDelete(tag)}
                accessibilityLabel={`Delete tag ${tag.name}`}
            >
                <FontAwesome5 name="trash" size={20} color="firebrick" />
            </StyledTouchableOpacity>
        </StyledView>
    );
};
