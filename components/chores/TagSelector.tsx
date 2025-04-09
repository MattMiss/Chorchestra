import React from 'react';
import { View, Text } from 'react-native';
//import { styled } from 'nativewind';
import { Tag } from '@/types';
import TagListHorizontal from "@/components/tags/TagListHorizontal";
import {Colors} from "@/constants/Colors";

// const View = styled(View);
// const Text = styled(Text);

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
        <View className="flex-grow ">
            {/* Label */}
            <Text className={`mb-2 text-xl text-secondary`}>Tags</Text>

            {/* Tag Container */}
            <View className="flex-grow">
                <TagListHorizontal
                    canRemoveTags={canRemoveTags}
                    tags={selectedTags}
                    onRemoveTag={onRemoveTag}
                    onAddTag={() => onToggleModal(true)}
                />
            </View>
        </View>
    );
};

export default TagSelector;
