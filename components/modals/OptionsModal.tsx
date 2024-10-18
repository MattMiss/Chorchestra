// src/components/OptionsModal.tsx

import React from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styled } from 'nativewind';
import {AntDesign} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface OptionsModalProps {
    visible: boolean;
    title?: string;
    option1Text: string;
    option2Text: string;
    onOption1Press: () => void;
    onOption2Press: () => void;
    onClose: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
                                                       visible,
                                                       title,
                                                       option1Text,
                                                       option2Text,
                                                       onOption1Press,
                                                       onOption2Press,
                                                       onClose,
                                                   }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className={`p-4 w-full max-w-md min-h-[200] rounded-t-3xl bg-medium`}>
                            <StyledView className="flex-1 items-center">
                                {title && <StyledText className={`text-lg font-semibold mb-4 text-primary`}>
                                    {title}
                                </StyledText>}

                                <StyledView className="flex-1 justify-center items-center w-full">
                                    <StyledTouchableOpacity
                                        className="w-full py-3 mb-2"
                                        onPress={() => {
                                            onClose();
                                            onOption1Press();
                                        }}
                                        accessibilityLabel={option1Text}
                                    >
                                        <StyledView className='flex-row items-center justify-center'>
                                            <StyledText className={`mr-2 text-center text-xl text-primary`}>
                                                {option1Text}
                                            </StyledText>
                                            <AntDesign name="right" size={18} color="white" />
                                        </StyledView>
                                    </StyledTouchableOpacity>

                                    <StyledTouchableOpacity
                                        className="w-full py-3"
                                        onPress={() => {
                                            onClose();
                                            onOption2Press();
                                        }}
                                        accessibilityLabel={option2Text}
                                    >
                                        <StyledView className='flex-row items-center justify-center'>
                                            <StyledText className={`mr-2 text-center text-xl text-primary`}>
                                                {option2Text}
                                            </StyledText>
                                            <AntDesign name="right" size={18} color="white" />
                                        </StyledView>
                                    </StyledTouchableOpacity>
                                </StyledView>
                            </StyledView>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default OptionsModal;
