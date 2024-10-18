import React, { useState, useCallback, useEffect } from 'react';
import {View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import {useDataContext} from "@/context/DataContext";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";
import {sortTagsByName} from "@/utils/helpers";
import {Colors} from "@/constants/Colors";

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

    const {setTags} = useDataContext();

    useEffect(() => {
        handleClearTag();
        if (visible && selectedTag){
            setTagInput(selectedTag.name);
        }
    }, [visible]);


    const handleClearTag = useCallback(() => {
        setTagInput('');
    }, []);


    const handleSaveNewTag = () => {
        const trimmedTag = tagInput.trim();

        // Exit if the input is empty after trimming
        if (trimmedTag.length === 0) return;

        // Either edit the selected tag or save a new tag if none are selected
        if (selectedTag) {
            // Update the name of the selected tag
            const updatedTag = { ...selectedTag, name: trimmedTag };

            // Update the tags state:
            // - Remove the old tag
            // - Add the updated tag at the beginning of the array
            setTags(prevTags => {
                const filteredTags = prevTags.filter(tag => tag.id !== selectedTag.id);
                const updatedTags = [updatedTag, ...filteredTags];
                return sortTagsByName(updatedTags); // Sort after updating
            });

        } else {
            // Check if the tag already exists in availableTags (case-insensitive)
            const tagExists = availableTags.some(tag => tag.name.toLowerCase() === trimmedTag.toLowerCase());

            if (tagExists) {
                // Optionally, notify the user that the tag already exists
                // Example using alert:
                // alert("This tag already exists.");
                return;
            }

            // Create the new tag object
            const newTag = { id: Date.now(), name: trimmedTag };
            setTags(prevTags => {
                const updatedTags = [...prevTags, newTag];
                return sortTagsByName(updatedTags); // Sort after adding
            });
        }

        // Clear the input field and close the modal/dialog
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
                                <StyledView className={`p-4 w-full max-w-md min-h-[240] rounded-t-3xl bg-medium`}>
                                    <TextInputFloatingLabel label="Tag Name" value={tagInput} onChangeText={setTagInput} />
                                    <StyledView className="mt-6">
                                        <StyledTouchableOpacity
                                            onPress={handleSaveNewTag}
                                            className="my-4 p-3 rounded-lg"
                                            style={{backgroundColor: Colors.buttonPrimary}}
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
