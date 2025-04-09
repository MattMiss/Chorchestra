import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
//import { styled } from 'nativewind';

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

interface ReportExportTypeModalProps {
    visible: boolean;
    onClose: () => void;
    onSendEmail: () => void;
    onExportFile: () => void;
}

const ReportExportTypeModal = ({ visible, onClose, onSendEmail, onExportFile }: ReportExportTypeModalProps) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <View className="p-4 w-full max-w-md min-h-[200] rounded-t-3xl bg-medium">
                            <Text className="text-lg font-bold mb-4 text-primary text-center">
                                Export Report
                            </Text>

                            {/* Option to Send Report via Email */}
                            <TouchableOpacity
                                onPress={() => {
                                    onSendEmail();
                                    onClose();
                                }}
                                className="p-4 mb-4 rounded-lg bg-buttonPrimary"
                            >
                                <Text className="text-primary text-center font-bold">Send as Email</Text>
                            </TouchableOpacity>

                            {/* Option to Export Report as File */}
                            <TouchableOpacity
                                onPress={() => {
                                    onExportFile();
                                    onClose();
                                }}
                                className="p-4 rounded-lg bg-buttonAlternative"
                            >
                                <Text className="text-primary text-center font-bold">Export as File</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ReportExportTypeModal;
