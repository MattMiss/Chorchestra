import React, { ReactNode, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutChangeEvent } from 'react-native';
import {ChoresGroupedByDate} from '@/types';
import { styled } from "nativewind";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface SpecificSectionListProps {
    sectionTitle: string;
    groupedChores: ChoresGroupedByDate; // Updated type for groupedChores
    icon?: ReactNode;
    onPress: () => void;
}

const ChoreSectionList = ({ sectionTitle, groupedChores, icon, onPress }: SpecificSectionListProps) => {
    const [scrollHeight, setScrollHeight] = useState<number | null>(null);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setScrollHeight(height * 0.7); // Setting ScrollView height to 70% of parent height
    };

    return (
        <StyledView className="flex-1 w-full p-4 mb-4 rounded-lg bg-medium" onLayout={handleLayout}>
            <StyledView className="flex-row items-start">
                <StyledView className="mt-[2]">
                    {icon || <AntDesign name="warning" size={24} color={Colors.textPrimary} />}
                </StyledView>
                <StyledView className="flex-1">
                    <StyledText className="ml-2 font-bold text-lg text-accent">{sectionTitle}:</StyledText>

                    {/* Scrollable List within controlled max-height */}
                    <ScrollView style={{ maxHeight: scrollHeight }} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={true}>
                        {Object.keys(groupedChores).map((dateKey) => (
                            <StyledView key={dateKey} className="mt-2">
                                {/* Date Header */}
                                <StyledText className="font-semibold text-primary mb-2">
                                    {dateKey}
                                </StyledText>

                                {/* List of Chores for the Date */}
                                {groupedChores[dateKey].map((chore) => (
                                    <StyledView key={chore.id} className="ml-4 mb-2 flex-row items-center">
                                        <StyledText className="text-secondary">{chore.name}</StyledText>
                                    </StyledView>
                                ))}
                            </StyledView>
                        ))}
                    </ScrollView>
                </StyledView>
                <StyledView className="mt-[2]">
                    <StyledTouchableOpacity
                        className="justify-center items-center"
                        onPress={onPress}
                    >
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>
        </StyledView>
    );
};

export default ChoreSectionList;
