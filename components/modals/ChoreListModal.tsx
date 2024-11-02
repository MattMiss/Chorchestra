import React from 'react';
import { Modal, TouchableOpacity, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { ProcessedChore, ChoresGroupedByDate } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);


interface ChoreListModalProps {
    visible: boolean;
    onClose: () => void;
    sectionTitle: string;
    groupedChores: ChoresGroupedByDate;
    completeChore: (chore: ProcessedChore) => void;
}

const ChoreListModal: React.FC<ChoreListModalProps> = ({ visible, onClose, sectionTitle, groupedChores, completeChore }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className="p-4 w-full max-w-md min-h-[200] max-h-[80%] rounded-t-3xl bg-medium">
                            <StyledText className="text-xl font-bold mb-4 text-accent">Chores {sectionTitle}</StyledText>

                            {/* List of Grouped Chores by Date */}
                            <StyledScrollView className="mb-2">
                                {Object.keys(groupedChores).length > 0 ? (
                                    Object.keys(groupedChores).map((dateKey) => (
                                        <StyledView key={dateKey} className="mt-2">
                                            {/* Date Header */}
                                            <StyledText className="font-semibold text-primary text-lg mb-1">
                                                {dateKey}
                                            </StyledText>

                                            {/* List of Chores for the Date */}
                                            {groupedChores[dateKey].map((chore) => (
                                                <StyledView key={chore.id} className="flex-row justify-between items-center mx-4 mb-1 border-b-1 border-b border-secondary">
                                                    <StyledText className="text-secondary ml-1">{chore.name}</StyledText>
                                                    <StyledTouchableOpacity
                                                        onPress={() => completeChore(chore)}
                                                        className="py-2 px-1 "
                                                    >
                                                        <AntDesign name="form" size={20} color="white" />
                                                    </StyledTouchableOpacity>
                                                </StyledView>
                                            ))}
                                        </StyledView>
                                    ))
                                ) : (
                                    <StyledText className="text-primary">No chores</StyledText>
                                )}
                            </StyledScrollView>

                            {/* Close Button */}
                            <StyledTouchableOpacity
                                onPress={onClose}
                                className="my-4 p-3 rounded-lg"
                                style={{ backgroundColor: Colors.buttonSecondary }}
                            >
                                <StyledText className="text-white text-center">Close</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ChoreListModal;
