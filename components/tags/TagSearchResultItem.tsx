import {Tag} from '@/types';
import React from "react";
import {styled} from 'nativewind';
import {TouchableOpacity, View, Text} from 'react-native';
import TagItem from "@/components/tags/TagItem";
import {Colors} from "@/constants/Colors";

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

interface TagSearchResultItemProps {
    tag: Tag,
    isAvailable: boolean;
    onTagSelected: (tag: Tag) => void;
}

const TagSearchResultItem: React.FC<TagSearchResultItemProps> = ({tag,isAvailable = false,  onTagSelected}) => {
    return(
        <StyledTouchableOpacity
            className="w-full items-start p-3"
            onPress={() => {
                onTagSelected(tag);
            }}
            disabled={!isAvailable}
        >
            <StyledView>
                {tag.id === -1 ? (
                    <StyledText className={`text-[${Colors.textPrimary}]`}>{`Create and add "${tag.name}"`}</StyledText>
                ) : (
                    <StyledView className="flex-row items-center">
                        <TagItem tag={tag} isAvailable={isAvailable} isRemovable={false} />
                    </StyledView>
                )}
            </StyledView>
        </StyledTouchableOpacity>

    )
}

export default TagSearchResultItem;