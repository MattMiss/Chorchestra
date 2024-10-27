// src/components/modals/ChoreListModal.tsx

import React from 'react';
import {Modal, TouchableOpacity, View, Text, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { ProcessedChore } from '@/types';
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
    chores: ProcessedChore[];
    completeChore: (chore: ProcessedChore) => void;
}

const ChoreListModal: React.FC<ChoreListModalProps> = ({ visible, onClose, sectionTitle, chores, completeChore }) => {

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className={`p-4 w-full max-w-md min-h-[200] rounded-t-3xl bg-medium`}>
                            <StyledText className="text-xl font-bold mb-4 text-accent">Chores {sectionTitle}</StyledText>

                            {/* List of Chores */}
                            <StyledScrollView className="mb-4">
                                {chores.length > 0 ? (
                                    chores.map((chore) => (
                                        <StyledView key={chore.id} className="flex-row justify-between items-center mb-2">
                                            <StyledView key={chore.id} className='flex-row items-center mb-1'>
                                                <StyledView className='flex-row bg-buttonSecondary rounded-lg p-1'>
                                                    <StyledText className="ml-1 text-primary w-[30]" >{chore.nextDueDate.format('ddd')}</StyledText>
                                                    <StyledText className="text-primary text-md w-[46]" >{chore.nextDueDate.format('MMM D')}</StyledText>
                                                </StyledView>
                                                <StyledText className="text-primary ml-2" >{chore.name}</StyledText>
                                            </StyledView>

                                            <StyledTouchableOpacity
                                                onPress={() => completeChore(chore)}
                                                className="p-2"
                                            >
                                                <StyledView className='flex-row items-center justify-end'>
                                                    {/*<StyledText className={`mr-2 text-lg text-primary`}>Add Entry</StyledText>*/}
                                                    <AntDesign name="form" size={20} color="white" />
                                                </StyledView>
                                            </StyledTouchableOpacity>
                                        </StyledView>
                                    ))                                ) : (
                                    <StyledText className="text-primary">No chores</StyledText>
                                )}
                            </StyledScrollView>

                            {/* Close Button */}
                            <StyledView className="mt-6">
                                <StyledTouchableOpacity
                                    onPress={onClose}
                                    className="my-4 p-3 rounded-lg"
                                    style={{backgroundColor: Colors.buttonSecondary}}
                                >
                                    <StyledText className="text-white text-center">
                                        Close
                                    </StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ChoreListModal;
