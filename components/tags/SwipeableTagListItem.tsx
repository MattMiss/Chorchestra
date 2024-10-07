// src/components/tags/SwipeableTagListItem.tsx

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styled } from 'nativewind';
import TagItem from './TagItem';
import { Tag } from '@/types';

interface SwipeableTagListItemProps {
    tag: Tag;
    onEdit: (tag: Tag) => void;
    onPickColor: (tagId: number) => void;
}

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SwipeableTagListItem: React.FC<SwipeableTagListItemProps> = React.memo(({ tag, onEdit, onPickColor }) => {
    return (
        <StyledView className="flex-row justify-between items-center p-2 bg-white">
            {/* TagItem on the left */}
            <TagItem tag={tag} isRemovable={false} textSize={'text-md'} />

            <StyledView className="flex-row gap-4">
                {/* Edit Tag Button */}
                <StyledTouchableOpacity
                    className="bg-green-500 p-2 rounded-lg"
                    onPress={() => onEdit(tag)}
                    accessibilityLabel={`Edit tag ${tag.name}`}
                >
                    <FontAwesome name="edit" size={20} color="white" />
                </StyledTouchableOpacity>

                {/* Pick Color Button */}
                <StyledTouchableOpacity
                    className="bg-blue-500 p-2 rounded-lg"
                    onPress={() => onPickColor(tag.id)}
                    accessibilityLabel={`Pick color for tag ${tag.name}`}
                >
                    <FontAwesome name="eyedropper" size={20} color="white" />
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
});

export default SwipeableTagListItem;
