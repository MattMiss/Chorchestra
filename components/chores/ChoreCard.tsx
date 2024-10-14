import React from 'react';
import { Text, View } from 'react-native';
import {Chore, Tag} from '@/types';
import { styled } from 'nativewind';
import TagList from "@/components/tags/TagListHorizontal";
import {getPriorityLevelColor, getPriorityLevelLabel} from "@/utils/helpers";
import {AntDesign, Entypo, Feather} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {Colors} from "@/constants/Colors";

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);

interface ChoreCardProps {
    chore: Chore;
    onCompletedPress?: () => void;
    onEditPress?: () => void;
    tags: Tag[];
    lastCompleted: string;
    timeLeft: string;
}

// ChoreCard component using reusable StyledText and StyledView
const ChoreCard: React.FC<ChoreCardProps> = ({ chore, tags, onCompletedPress, onEditPress, lastCompleted, timeLeft }) => {
    // Determine if the chore is overdue
    const isOverdue = timeLeft === 'Due now' || timeLeft.includes('ago');

    const priorityColor = getPriorityLevelColor(chore.priority);
    const priorityLabel = getPriorityLevelLabel(chore.priority) || 'N/A';

    return (
        <StyledView
            className={`bg-[${Colors.backgroundMedium}] shadow-md rounded-lg p-4 mb-3 ${isOverdue ? 'border border-red-500' : ''}`}
            accessibilityLabel={`Chore: ${chore.name}`}
        >

            <StyledView className='flex-row justify-between items-center'>
                {/* Last Completed Date and Time */}
                <StyledView className="flex-row items-center flex-1">
                    <AntDesign name="calendar" size={20} color="white" />
                    <StyledText className={`ml-2 text-[${Colors.textSecondary}]`}>{lastCompleted}</StyledText>
                </StyledView>

                {/* Relative Time */}
                <StyledView className="flex-row items-center flex-1 justify-end">
                    <AntDesign name="clockcircleo" size={20} color="white" />
                    <StyledText className={`ml-2 text-[${Colors.textSecondary}]`}>{timeLeft}</StyledText>
                </StyledView>

                <StyledView className='ml-4'>
                    <Menu>
                        <MenuTrigger>
                            <Entypo name="dots-three-vertical" size={20} color="white"/>
                        </MenuTrigger>

                        <MenuOptions optionsContainerStyle={{backgroundColor: Colors.backgroundPopup, borderRadius: 8, padding: 10, width: 150}}>
                            <MenuOption
                                onSelect={onCompletedPress}
                                customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                style={{height: 40 }}
                                >
                                <StyledView className='flex-row items-center justify-end'>
                                    <StyledText className={`mr-2 text-lg text-[${Colors.textPrimary}]`}>Add Entry</StyledText>
                                    <AntDesign name="calendar" size={20} color="white" />
                                </StyledView>

                            </MenuOption>
                            <MenuOption
                                onSelect={onEditPress}
                                customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                style={{height: 40}}
                            >
                                <StyledView className='flex-row items-center justify-end'>
                                    <StyledText className={`mr-2 text-lg text-[${Colors.textPrimary}]`}>Edit Chore</StyledText>
                                    <AntDesign name="form" size={20} color="white" />
                                </StyledView>

                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </StyledView>
            </StyledView>

            {/* Divider */}
            <StyledView className="h-px bg-gray-700 my-3" />

            {/* Chore Name */}
            <StyledText className={`text-lg font-bold text-[${Colors.textPrimary}]`}>{chore.name}</StyledText>

            {/* Chore Description */}
            <StyledText className={`text-sm mt-1 text-[${Colors.textSecondary}]`}>{chore.description}</StyledText>

            {/* Details Container */}
            <StyledView className="flex-row mt-4 justify-between">
                {/* Estimated Time */}
                <StyledView className="flex-1 flex-row">
                    <Ionicons name="timer-outline" size={20} color={Colors.accent} className="mr-2" />
                    <StyledText className={`pl-1 text-sm text-[${Colors.textSecondary}]`}>
                        {`${chore.estTime} ${chore.estTimeType}${chore.estTime > 1 ? 's' : ''}`}
                    </StyledText>
                </StyledView>

                {/* Frequency */}
                <StyledView className="flex-1 flex-row justify-center">
                    <Feather name="repeat" size={20} color={Colors.accent} className="mr-2" />
                    <StyledText className={`pl-1 text-sm text-[${Colors.textSecondary}]`}>
                        {`${chore.frequency} ${chore.frequencyType}${chore.frequency > 1 ? 's' : ''}`}
                    </StyledText>
                </StyledView>

                {/* Priority */}
                <StyledView className="flex-1 flex-row justify-end">
                    <Ionicons name="flag" size={20} color={priorityColor} className="mr-2" />
                    <StyledText className="pl-1 text-sm" style={{color: priorityColor}}>{priorityLabel}</StyledText>
                </StyledView>
            </StyledView>

            {/* Tags */}
            <StyledView className='mt-4'>
                <TagList tags={tags} />
            </StyledView>
        </StyledView>
    );
};


export default ChoreCard;
