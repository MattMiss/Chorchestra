import React, {ReactNode, useMemo} from 'react';
import { Modal, TouchableOpacity, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { ProcessedChore, ChoresGroupedByDate } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
//import { styled } from 'nativewind';
import {formatDate} from "@/utils/dateHelpers";
import dayjs from "@/utils/dayjsConfig";

// const View = styled(View);
// const ScrollView = styled(ScrollView);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);


interface ChoreListModalProps {
    visible: boolean;
    onClose: () => void;
    sectionTitle: string;
    sectionIcon?: ReactNode;
    groupedChores: ChoresGroupedByDate;
    completeChore: (chore: ProcessedChore) => void;
}


const ChoreListModal: React.FC<ChoreListModalProps> = ({ visible, onClose, sectionTitle, sectionIcon, groupedChores, completeChore }) => {

    // Sort dates using dayjs and display the chores in order
    const sortedDates = useMemo(() => Object.keys(groupedChores).sort((a, b) => {
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1;
    }), [groupedChores]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <View className="p-4 w-full max-w-md min-h-[200] max-h-[80%] rounded-t-3xl bg-medium">
                            <View className="flex-row items-center mb-2">
                                <View className="mb-2">
                                    {sectionIcon || <AntDesign name="warning" size={24} color={Colors.textPrimary} />}
                                </View>
                                <View className="flex-1 mx-2 pt-2 w-full">
                                    <Text className="text-xl font-bold mb-4 text-accent">Chores {sectionTitle}</Text>
                                </View>
                            </View>

                            {/* List of Grouped Chores by Date */}
                            <ScrollView className="mb-2">
                                {sortedDates.length > 0 ? (
                                    sortedDates.map((dateKey) => (
                                        <View key={dateKey} className="mt-2">
                                            {/* Date Header */}
                                            <Text className="font-semibold text-primary text-lg mb-1">
                                                {formatDate(dateKey)}
                                            </Text>

                                            {/* List of Chores for the Date */}
                                            {groupedChores[dateKey].map((chore) => (
                                                <View key={chore.id} className="flex-row justify-between items-center mx-4 mb-1 border-b-1 border-b border-secondary">
                                                    <Text className="text-secondary ml-1">{chore.name}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => completeChore(chore)}
                                                        className="py-2 px-1 "
                                                    >
                                                        <AntDesign name="form" size={20} color="white" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-primary">No chores</Text>
                                )}
                            </ScrollView>

                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={onClose}
                                className="my-4 p-3 rounded-lg"
                                style={{ backgroundColor: Colors.buttonSecondary }}
                            >
                                <Text className="text-white text-center">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ChoreListModal;
