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
            className="bg-[#1C1F26] p-4 rounded-3xl shadow-sm my-2 mx-4"
            onPress={onPress}
        >
            {/* Chore Name */}
            <StyledText className="text-lg font-bold text-[#F7FAFF]">{chore.name}</StyledText>

            {/* Chore Description */}
            <StyledText className="text-[#858E9F] text-sm">{chore.description}</StyledText>

            {/* Est Time */}
            <StyledView className='flex-row'>
                <StyledText className="text-[#14A8CC] text-sm">{'Est Time:'}</StyledText>
                <StyledText className="text-[#858E9F] text-sm">{` ${chore.estTime} ${chore.estTimeType}${chore.estTime > 1 ? 's' : ''}`}</StyledText>
            </StyledView>

            {/* Frequency */}
            <StyledView className='flex-row'>
                <StyledText className="text-[#14A8CC] text-sm">{'Frequency:'}</StyledText>
                <StyledText className="text-[#858E9F] text-sm">{` ${chore.frequency} ${chore.frequencyType}${chore.frequency > 1 ? 's' : ''}`}</StyledText>
            </StyledView>


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
