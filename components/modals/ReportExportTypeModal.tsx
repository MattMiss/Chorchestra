import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className="p-4 w-full max-w-md min-h-[200] rounded-t-3xl bg-medium">
                            <StyledText className="text-lg font-bold mb-4 text-primary text-center">
                                Export Report
                            </StyledText>

                            {/* Option to Send Report via Email */}
                            <StyledTouchableOpacity
                                onPress={() => {
                                    onSendEmail();
                                    onClose();
                                }}
                                className="p-4 mb-4 rounded-lg bg-buttonPrimary"
                            >
                                <StyledText className="text-primary text-center font-bold">Send as Email</StyledText>
                            </StyledTouchableOpacity>

                            {/* Option to Export Report as File */}
                            <StyledTouchableOpacity
                                onPress={() => {
                                    onExportFile();
                                    onClose();
                                }}
                                className="p-4 rounded-lg bg-buttonAlternative"
                            >
                                <StyledText className="text-primary text-center font-bold">Export as File</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ReportExportTypeModal;
