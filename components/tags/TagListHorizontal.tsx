import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
//import { styled } from 'nativewind';
import { Tag } from '@/types';
import TagItem from '@/components/tags/TagItem';
import {AntDesign} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

interface TagListProps {
    tags: Tag[];
    canRemoveTags?: boolean;
    onRemoveTag?: (tagId: number) => void;
    onAddTag?: () => void;
}

// Reusable styled component
// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

const TagList: React.FC<TagListProps> = ({ tags, canRemoveTags = false, onRemoveTag, onAddTag }) => {

    const tagsToShow = useMemo(() => {
        // Append the addTagItem if tags are removable
        return canRemoveTags ? [...tags, { id: -1, name: 'Add' }] : tags;
    }, [canRemoveTags, tags]);

    //console.log('Tags to Show:', tagsToShow);

    return (
        <View className="flex-row flex-wrap">
            {tagsToShow.map((item) => {
                if (item.id === -1) {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            className="flex-row items-center rounded-xl pt-2"
                            onPress={onAddTag}
                        >
                            <AntDesign name="plus" size={16} color="white" />
                            <Text className={`ml-1 text-primary`}>Tag</Text>
                        </TouchableOpacity>
                    );
                } else {
                    return (
                        <View key={item.id} className={`mb-1 ${canRemoveTags ? 'mt-3 mr-2' : ''}`}>
                            <TagItem tag={item} isRemovable={canRemoveTags} onRemove={onRemoveTag} />
                        </View>
                    );
                }
            })}
        </View>
    );
};

export default TagList;
