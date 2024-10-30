// src/components/chores/EntryCard.tsx

import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import { Entry, Chore } from '@/types';
import { styled } from 'nativewind';
import { getChoreNameById } from "@/utils/helpers";
import dayjs from '@/utils/dayjsConfig';
import {AntDesign, Entypo} from '@expo/vector-icons';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {Colors} from "@/constants/Colors"; // Importing Material Icons

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);

interface EntryCardProps {
    entry: Entry;
    onEditPress: () => void;
    onDeletePress?: () => void;
    chores: Chore[];
}

// EntryCard component with enhanced date/time display
const EntryCard: React.FC<EntryCardProps> = ({ entry, onDeletePress, onEditPress, chores }) => {
    const choreName = getChoreNameById(chores, entry.choreId) || "Unknown Chore";
    const completedDate = dayjs(entry.dateCompleted);
    const formattedDate = completedDate.format('MMM DD, YY h:mm A'); // e.g., September 14, 2023 3:45 PM

    return (
        <StyledView
            className={`px-2 mb-2`}
            accessibilityLabel={`Chore completed on ${formattedDate}`}
        >
            <StyledView className='flex-row'>
                <StyledView className="flex-[35%]">
                    <StyledText className={`ml-2 font-bold text-primary text-sm`}>
                        {dayjs(completedDate).format('MMM ddd D')}
                    </StyledText>
                    <StyledText className={`ml-2 font-bold text-primary text-xs`}>
                        {dayjs(completedDate).format('h:mm A')}
                    </StyledText>
                </StyledView>
                {/* Chore Name */}
                <StyledText className={`flex-[65%] pt-1 text-xs font-bold text-accent`}>{choreName}</StyledText>

                <StyledView className=''>
                    <Menu>
                        <MenuTrigger>
                            <Entypo name="dots-three-vertical" size={20} color="white"/>
                        </MenuTrigger>

                        <MenuOptions optionsContainerStyle={{backgroundColor: Colors.backgroundPopup, borderRadius: 8, padding: 10, width: 120}}>
                            <MenuOption
                                onSelect={onEditPress}
                                customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                style={{height: 40 }}
                            >
                                <StyledView className='flex-row items-center justify-end'>
                                    <StyledText className={`mr-2 text-lg text-primary`}>Edit</StyledText>
                                    <AntDesign name="calendar" size={20} color="white" />
                                </StyledView>

                            </MenuOption>
                            <MenuOption
                                onSelect={onDeletePress}
                                customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                style={{height: 40 }}
                            >
                                <StyledView className='flex-row items-center justify-end'>
                                    <StyledText className={`mr-2 text-lg text-primary`}>Delete</StyledText>
                                    <AntDesign name="delete" size={20} color="white" />
                                </StyledView>

                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </StyledView>
            </StyledView>


            {/*<StyledView className='flex-row justify-between items-center'>*/}
            {/*    /!* Relative Time *!/*/}
            {/*    <StyledView className="flex-row items-center flex-1 justify-end">*/}
            {/*        <AntDesign name="clockcircleo" size={20} color="white" />*/}
            {/*        <StyledText className={`ml-2 text-sm text-secondary`}>{relativeTime}</StyledText>*/}
            {/*    </StyledView>*/}
            {/*</StyledView>*/}
        </StyledView>
    );
};

export default EntryCard;
