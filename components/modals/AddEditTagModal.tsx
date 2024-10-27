import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";
import { Colors } from "@/constants/Colors";
import { useTagsContext } from "@/context/TagsContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TagModalProps {
    selectedTag: Tag | null;
    visible: boolean;
    onClose: () => void;
    availableTags: Tag[];
}

const AddEditTagModal = ({ selectedTag, visible, onClose, availableTags }: TagModalProps) => {
    const [tagInput, setTagInput] = useState('');

    const { addTag, editTag } = useTagsContext();

    useEffect(() => {
        handleClearTag();
        if (visible && selectedTag) {
            setTagInput(selectedTag.name);
        }
    }, [visible, selectedTag]);

    const handleClearTag = useCallback(() => {
        setTagInput('');
    }, []);

    const handleSaveTag = () => {
        const trimmedTag = tagInput.trim();

        // Exit if the input is empty after trimming
        if (trimmedTag.length === 0) return;

        if (selectedTag) {
            // Update the name of the selected tag
            const updatedTag = { ...selectedTag, name: trimmedTag };
            editTag(updatedTag); // Use editTag from context
        } else {
            // Check if the tag already exists in availableTags (case-insensitive)
            const tagExists = availableTags.some(tag => tag.name.toLowerCase() === trimmedTag.toLowerCase());

            if (tagExists) {
                // Optionally, notify the user that the tag already exists
                // Example using alert:
                // alert("This tag already exists.");
                return;
            }

            // Create and add the new tag
            const newTag = { id: Date.now(), name: trimmedTag };
            addTag(newTag); // Use addTag from context
        }

        // Clear the input field and close the modal
        handleClearTag();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                        <TouchableWithoutFeedback>
                            <StyledView className="p-4 w-full max-w-md min-h-[240] rounded-t-3xl bg-medium">
                                <TextInputFloatingLabel label="Tag Name" value={tagInput} onChangeText={setTagInput} />
                                <StyledView className="mt-6">
                                    <StyledTouchableOpacity
                                        onPress={handleSaveTag}
                                        className="my-4 p-3 rounded-lg"
                                        style={{ backgroundColor: Colors.buttonPrimary }}
                                    >
                                        <StyledText className="text-white text-center">
                                            {selectedTag ? 'Save' : 'Add Tag'}
                                        </StyledText>
                                    </StyledTouchableOpacity>
                                </StyledView>
                            </StyledView>
                        </TouchableWithoutFeedback>
                    </StyledView>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default AddEditTagModal;
