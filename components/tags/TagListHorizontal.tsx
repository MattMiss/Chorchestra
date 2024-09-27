import React, { useMemo } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import TagItem from '@/components/tags/TagItem';
import {AntDesign} from "@expo/vector-icons";

interface TagListProps {
    tags: Tag[];
    canRemoveTags?: boolean;
    onRemoveTag?: (tagId: number) => void;
    onAddTag?: () => void;
}

// Reusable styled component
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TagList: React.FC<TagListProps> = ({ tags, canRemoveTags = false, onRemoveTag, onAddTag }) => {

    const tagsToShow = useMemo(() => {
        // Append the addTagItem if tags are removable
        return canRemoveTags ? [...tags, { id: -1, name: 'Add' }] : tags;
    }, [canRemoveTags, tags]);

    //console.log('Tags to Show:', tagsToShow);

    return (
        <StyledView className="mt-3 flex-row flex-wrap">
            <FlatList
                data={tagsToShow}
                horizontal
                renderItem={({ item }) => {
                    if (item.id === -1) {
                        return (
                            <StyledTouchableOpacity
                                className="flex-row items-center px-2 py-1 rounded-xl mr-2 mb-2"
                                onPress={onAddTag}
                            >
                                <AntDesign name="plus" size={16} color="white" />
                                <StyledText className="ml-1 text-white">Tag</StyledText>
                            </StyledTouchableOpacity>
                        );
                    } else {
                        return (
                            <TagItem tag={item} isRemovable={canRemoveTags} onRemove={onRemoveTag} />
                        );
                    }
                }}
                keyExtractor={(item) => item.id.toString()}
                extraData={tagsToShow} // Force re-render when tagsToShow changes
            />
        </StyledView>
    );
};

export default TagList;
