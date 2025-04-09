import {Tag} from '@/types';
import React from "react";
//import {styled} from 'nativewind';
import {TouchableOpacity, View, Text} from 'react-native';
import TagItem from "@/components/tags/TagItem";
import {Colors} from "@/constants/Colors";

// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);
// const View = styled(View);

interface TagSearchResultItemProps {
    tag: Tag,
    isAvailable: boolean;
    onTagSelected: (tag: Tag) => void;
}

const TagSearchResultItem: React.FC<TagSearchResultItemProps> = ({tag,isAvailable = false,  onTagSelected}) => {
    return(
        <TouchableOpacity
            className="w-full items-start p-3"
            onPress={() => {
                onTagSelected(tag);
            }}
            disabled={!isAvailable}
        >
            <View>
                {tag.id === -1 ? (
                    <Text className={`text-primary`}>{`Create and add "${tag.name}"`}</Text>
                ) : (
                    <View className="flex-row items-center">
                        <TagItem tag={tag} isAvailable={isAvailable} isRemovable={false} />
                    </View>
                )}
            </View>
        </TouchableOpacity>

    )
}

export default TagSearchResultItem;