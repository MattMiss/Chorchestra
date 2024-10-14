// src/components/modals/ColorPickerModal.tsx

import React, { useState, useEffect } from 'react';
import {Modal, View, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { styled } from 'nativewind';
import TagItem from '@/components/tags/TagItem';
import { Tag } from '@/types';
import {getContrastingTextColor} from "@/utils/helpers";
import {COLOR_PALETTE, Colors} from "@/constants/Colors";

// Reusable styled components
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ColorPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectColor: (color: string) => void;
    tag: Tag | null;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ visible, onClose, onSelectColor, tag }) => {
    const [tempColor, setTempColor] = useState<string>(tag?.color || Colors.defaultTagColor);
    const originalColor = tag?.color || Colors.defaultTagColor;

    // Reset tempColor when the modal is opened or the tag changes
    useEffect(() => {
        if (visible) {
            setTempColor(originalColor);
        }
    }, [visible, originalColor]);

    const handleColorSelect = (color: string) => {
        setTempColor(color);
    };

    const handleSave = () => {
        onSelectColor(tempColor);
        onClose();
    };

    const handleCancel = () => {
        setTempColor(originalColor);
        onClose();
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={handleCancel}
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className={`p-8 w-full max-w-md min-h-[300] rounded-t-3xl bg-[${Colors.backgroundMedium}]`}>
                            {
                                tag &&
                                <StyledView className=''>
                                    <StyledView className='flex-row justify-between mb-4 mr-2'>
                                        <StyledText className={`text-[${Colors.textPrimary}]`}>Original</StyledText>
                                        <StyledText className={`text-[${Colors.textPrimary}]`}>New</StyledText>
                                    </StyledView>
                                    <StyledView className='flex-row justify-between mb-4'>
                                        {/* Tag Preview */}
                                        <TagItem tag={tag} isRemovable={false} textSize="text-md"/>
                                        <TagItem tag={{...tag, color: tempColor}} isRemovable={false} textSize="text-md"/>
                                    </StyledView>
                                </StyledView>
                            }
                            <StyledView className='border-b-gray-400 border-b-2 mb-2'></StyledView>

                            {/* Render each color group as a row */}
                            <ScrollView>
                                {COLOR_PALETTE.map((colorGroup, index) => (
                                    <StyledView key={index} className="flex-row justify-around mb-4">
                                        {colorGroup.map((color, shadeIndex) => (
                                            <StyledTouchableOpacity
                                                key={shadeIndex}
                                                className={`w-10 h-10 rounded-full border-2 ${
                                                    tempColor === color ? 'border-black border-1' : originalColor === color ? 'border-white border-2' : 'border-0'
                                                } flex justify-center items-center`}
                                                style={{ backgroundColor: color }}
                                                onPress={() => handleColorSelect(color)}
                                                accessibilityLabel={`Select color ${color}`}
                                            >
                                                {originalColor === color && tempColor !== color && (
                                                    <StyledText className="text-center" style={{ color: getContrastingTextColor(color) }}>*</StyledText>
                                                )}
                                                {tempColor === color && (
                                                    <StyledText className="text-center" style={{ color: getContrastingTextColor(color) }}>✓</StyledText>
                                                )}
                                            </StyledTouchableOpacity>
                                        ))}
                                    </StyledView>
                                ))}
                            </ScrollView>

                            {/* Buttons */}
                            <StyledView className="flex-row gap-4 justify-between mt-4">
                                <StyledTouchableOpacity
                                    className="flex-1 px-4 py-2 rounded-full items-center"
                                    onPress={handleCancel}
                                    accessibilityLabel="Cancel color change"
                                    style={{backgroundColor: Colors.buttonSecondary}}
                                >
                                    <StyledText className={`text-[${Colors.textPrimary}]`}>Cancel</StyledText>
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity
                                    className="flex-1 px-4 py-2 rounded-full items-center"
                                    onPress={handleSave}
                                    accessibilityLabel="Save color change"
                                    style={{backgroundColor: Colors.buttonPrimary}}
                                >
                                    <StyledText className={`text-[${Colors.textPrimary}]`}>Save</StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ColorPickerModal;
