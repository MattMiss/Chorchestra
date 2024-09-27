import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {Chore, Tag} from '@/types';
import { styled } from 'nativewind';
import TagList from "@/components/tags/TagListHorizontal";
import {getPriorityLevelColor, getPriorityLevelLabel} from "@/utils/helpers";

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ChoreCardProps {
    chore: Chore;
    onPress?: () => void;
    tags: Tag[];
}

// ChoreCard component using reusable StyledText and StyledView
const ChoreCard: React.FC<ChoreCardProps> = ({ chore, onPress, tags }) => {

    return (
        <StyledTouchableOpacity
            className="bg-white p-4 rounded-lg shadow-sm my-2 mx-4"
            onPress={onPress}
        >
            {/* Chore Name */}
            <StyledText className="text-lg font-bold text-black">{chore.name}</StyledText>

            {/* Chore Description */}
            <StyledText className="text-gray-600 text-sm">{chore.description}</StyledText>

            {/* Frequency */}
            <StyledText className="text-gray-500 text-sm">
                {`Frequency: ${chore.frequency} ${chore.frequencyType}`}
            </StyledText>

            {/* Priority */}
            <StyledText className={"text-sm"} style={{color: getPriorityLevelColor(chore.priority)}}>
                {`Priority: ${getPriorityLevelLabel(chore.priority) || 'Label Not Found'}`}
            </StyledText>

            {/* Tags */}
            <StyledView className='mt-2'>
                <TagList tags={tags} />
            </StyledView>
        </StyledTouchableOpacity>
    );
};


export default ChoreCard;
