import React, {ReactNode, useMemo, useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutChangeEvent } from 'react-native';
import {ChoresGroupedByDate} from '@/types';
import { styled } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import dayjs from "@/utils/dayjsConfig";
import {formatDate} from "@/utils/dateHelpers";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface SpecificSectionListProps {
    sectionTitle: string;
    groupedChores: ChoresGroupedByDate; // Updated type for groupedChores
    icon?: ReactNode;
    onPress: () => void;
    cName?: string;
}

const ChoreSectionList = ({ sectionTitle, groupedChores, icon, onPress, cName = '' }: SpecificSectionListProps) => {
    const [scrollHeight, setScrollHeight] = useState<number | null>(null);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setScrollHeight(height * 0.8); // Setting ScrollView height to 70% of parent height
    };

    // Sort dates using dayjs and display the chores in order
    const sortedDates = useMemo(() => Object.keys(groupedChores).sort((a, b) => {
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1;
    }), [groupedChores]);

    return (
        <StyledView className={`flex-1 w-full p-2 mb-4 rounded-lg bg-medium ${cName}`} onLayout={handleLayout}>
            <StyledTouchableOpacity
                className="justify-center items-center"
                onPress={onPress}
            >
                <StyledView className="flex-row items-start mb-1">
                    <StyledView className="mt-[2]">
                        {icon || <AntDesign name="warning" size={20} color={Colors.textPrimary} />}
                    </StyledView>
                    <StyledView className="flex-1 mx-3 pt-1 w-full">
                        <StyledText className="text-lg font-bold text-accent">{sectionTitle}</StyledText>
                    </StyledView>

                    {/*<StyledView className="mt-[2]">*/}
                    {/*    <Entypo name="dots-three-horizontal" size={22} color="white" />*/}
                    {/*</StyledView>*/}
                </StyledView>
            </StyledTouchableOpacity>
            <StyledView className={`border border-b opacity-30 border-secondary ${sortedDates.length > 0 ? 'mb-4' : ''}`}></StyledView>
            {/* Scrollable List within controlled max-height */}
            <ScrollView
                style={{
                    maxHeight: scrollHeight
                }}
                contentContainerStyle={{
                    flexGrow: 1, // Ensures content fills space while allowing scrolling
                    justifyContent: sortedDates.length > 0 ? 'flex-start' : 'center', // Center if no dates
                }}
                showsVerticalScrollIndicator
            >
                {sortedDates.length > 0 ? sortedDates.map((dateKey) => {
                        return(
                            <StyledView key={dateKey} className="w-full">
                                {/* Date Header */}
                                <StyledText className="font-semibold text-primary mx-auto mb-2">
                                    {formatDate(dateKey)}
                                </StyledText>

                                {/* List of Chores for the Date */}
                                {groupedChores[dateKey].map((chore) => (
                                    <StyledView key={chore.id} className="mb-2 flex-row items-center">
                                        <StyledText className="text-secondary">{chore.name}</StyledText>
                                    </StyledView>
                                ))}
                            </StyledView>
                        )}
                    ) :
                    <StyledView className="m-auto">
                        <AntDesign name="check" size={90} color={Colors.iconGreen} />
                    </StyledView>
                }
            </ScrollView>
        </StyledView>
    );
};

export default ChoreSectionList;
