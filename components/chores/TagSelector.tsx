import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import TagListHorizontal from "@/components/tags/TagListHorizontal";

const StyledView = styled(View);
const StyledText = styled(Text);

const TagSelector = ({
                         canRemoveTags,
                         selectedTags,
                         onRemoveTag,
                         onToggleModal,
                     }: {
    canRemoveTags?: boolean;
    selectedTags: Tag[];
    onRemoveTag: (tagId: number) => void;
    onToggleModal: (showModal: boolean) => void;
}) => {
    return (
        <StyledView className="flex-grow py-1">
            {/* Label */}
            <StyledView className="flex-row justify-between">
                <StyledText className="text-xl text-gray-400">Tags</StyledText>
            </StyledView>

            {/* Tag Container */}
            <StyledView className="flex-grow p-1">
                <TagListHorizontal
                    canRemoveTags={canRemoveTags}
                    tags={selectedTags}
                    onRemoveTag={onRemoveTag}
                    onAddTag={() => onToggleModal(true)}
                />
            </StyledView>
        </StyledView>
    );
};

export default TagSelector;
