// src/components/chores/EntryListItem.tsx
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import { Text } from 'react-native';
import { Entry, Chore } from '@/types';
import { styled } from 'nativewind';
import { getChoreNameById } from "@/utils/helpers";
import dayjs from '@/utils/dayjsConfig';
import {FontAwesome5} from '@expo/vector-icons';
import {Colors} from "@/constants/Colors"; // Importing Material Icons

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface EntryListItemProps {
    entry: Entry;
    chores: Chore[];
}

interface EntryListItemHiddenProps {
    onEditPress: () => void;
    onDeletePress?: () => void;
}

// EntryCard component with enhanced date/time display
export const EntryListItem: React.FC<EntryListItemProps> = ({ entry, chores }) => {
    const choreName = getChoreNameById(chores, entry.choreId) || "Unknown Chore";
    const completedDate = dayjs(entry.dateCompleted);
    const formattedDate = completedDate.format('MMM DD, YY h:mm A'); // e.g., September 14, 2023 3:45 PM

    return (
        <StyledView
            className={`h-12 px-2 py-1 mb-2 bg-medium rounded`}
            accessibilityLabel={`Chore completed on ${formattedDate}`}
        >
            <StyledView className='flex-row items-center'>
                <StyledView className="flex-[30%]">
                    <StyledText className={`ml-2 font-bold text-primary text-sm`}>
                        {dayjs(completedDate).format('MMM ddd D')}
                    </StyledText>
                    <StyledText className={`ml-2 font-bold text-primary text-xs`}>
                        {dayjs(completedDate).format('h:mm A')}
                    </StyledText>
                </StyledView>
                {/* Chore Name */}
                <StyledText className={'flex-[70%] pt-1 text-xs font-bold text-accent items-start'}>{choreName}</StyledText>
            </StyledView>
        </StyledView>
    );
};


export const EntryListItemHidden: React.FC<EntryListItemHiddenProps> = ({ onDeletePress, onEditPress }) => {
    return (
        <StyledView
            className={`h-12 px-1 mb-2`}
        >
            <StyledView className='flex-row my-auto justify-end'>
                <StyledTouchableOpacity
                    className="p-2 mr-2 justify-center items-center"
                    onPress={onEditPress}
                >
                    <FontAwesome5 name="pen" size={20} color={Colors.iconEdit} />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                    className="p-2 justify-center items-center"
                    onPress={onDeletePress}
                >
                    <FontAwesome5 name="trash" size={20} color={Colors.iconDelete} />
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    )
}

