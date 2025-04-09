// src/components/OptionsModal.tsx

import React from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
//import { styled } from 'nativewind';
import {AntDesign} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

// Reusable styled components
// const Text = styled(Text);
// const View = styled(View);
// const TouchableOpacity = styled(TouchableOpacity);

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
                <View className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <View className={`p-4 w-full max-w-md min-h-[200] rounded-t-3xl bg-medium`}>
                            <View className="flex-1 items-center">
                                {title && <Text className={`text-lg font-semibold mb-4 text-primary`}>
                                    {title}
                                </Text>}

                                <View className="flex-1 justify-center items-center w-full">
                                    <TouchableOpacity
                                        className="w-full py-3 mb-2"
                                        onPress={() => {
                                            onClose();
                                            onOption1Press();
                                        }}
                                        accessibilityLabel={option1Text}
                                    >
                                        <View className='flex-row items-center justify-center'>
                                            <Text className={`mr-2 text-center text-xl text-primary`}>
                                                {option1Text}
                                            </Text>
                                            <AntDesign name="right" size={18} color="white" />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="w-full py-3"
                                        onPress={() => {
                                            onClose();
                                            onOption2Press();
                                        }}
                                        accessibilityLabel={option2Text}
                                    >
                                        <View className='flex-row items-center justify-center'>
                                            <Text className={`mr-2 text-center text-xl text-primary`}>
                                                {option2Text}
                                            </Text>
                                            <AntDesign name="right" size={18} color="white" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default OptionsModal;
