import React, {useMemo, useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutChangeEvent } from 'react-native';
import {ChoresGroupedByDate} from '@/types';
//import { styled } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import dayjs from "@/utils/dayjsConfig";
import {formatDate} from "@/utils/dateHelpers";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

interface SpecificSectionListProps {
    sectionTitle: string;
    groupedChores: ChoresGroupedByDate; // Updated type for groupedChores
}

const ChoreSectionList = ({ sectionTitle, groupedChores }: SpecificSectionListProps) => {
    const [scrollHeight, setScrollHeight] = useState<number | null>(null);

    // Sort dates using dayjs and display the chores in order
    const sortedDates = useMemo(() => Object.keys(groupedChores).sort((a, b) => {
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1;
    }), [groupedChores]);

    return (
        <View className='flex-1 w-full pt-4 px-4'>
            {/* <TouchableOpacity
                className="justify-center items-center"
                onPress={onPress}
            >
                <View className="flex-row items-start mb-1">
                    <View className="mt-[2]">
                        {icon || <AntDesign name="warning" size={20} color={Colors.textPrimary} />}
                    </View>
                    <View className="flex-1 mx-3 pt-1 w-full">
                        <Text className="text-lg font-bold text-accent">{sectionTitle}</Text>
                    </View>
                </View>
            </TouchableOpacity> */}
            {/* <View className={`border border-b opacity-30 border-secondary ${sortedDates.length > 0 ? 'mb-4' : ''}`}></View> */}
            {/* Scrollable List within controlled max-height */}
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1, // Ensures content fills space while allowing scrolling
                    justifyContent: sortedDates.length > 0 ? 'flex-start' : 'center', // Center if no dates
                }}
                showsVerticalScrollIndicator
            >
                {sortedDates.length > 0 ? sortedDates.map((dateKey) => {
                        return(
                            <View key={dateKey} className="w-full ml-4 mb-1">
                                {/* Date Header */}
                                <Text className="font-semibold text-lg text-primary mx-auto mb-2">
                                    {formatDate(dateKey)}
                                </Text>

                                {/* List of Chores for the Date */}
                                {groupedChores[dateKey].map((chore) => (
                                    <View key={chore.id} className="mb-1 ml-5 flex-row items-center">
                                        <Text className="text-secondary text-lg">{chore.name}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    ) :
                    <View className="m-auto w-[90]">
                        <AntDesign name="check" size={90} color={Colors.iconGreen} />
                    </View>
                }
            </ScrollView>
        </View>
    );
};

export default ChoreSectionList;
