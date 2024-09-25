import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import { styled } from 'nativewind';
import { getAllTags, insertNoteWithTags } from '@/database/database';
import { SQLRows } from '@/database/types';
import { useNavigation } from '@react-navigation/native';
import TagModal from '@/components/modals/TagModal';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddNoteScreen = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [availableTags, setAvailableTags] = useState<SQLRows>([]);
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        void fetchTags();
    }, []);

    useEffect(() => {
        console.log('Selected Tags: ', selectedTags);
    }, [selectedTags]);

    const copy =
        `Some text above
  ___

  Some text in the middle

  ---

  Some text below`;


    const fetchTags = async () => {
        const tags: SQLRows = await getAllTags();
        setAvailableTags(
            tags.map((tag) => ({
                id: tag.id.toString(),
                title: tag.name || '', // Ensure title is always a string, fallback to empty string
            }))
        );
    };

    const handleSaveNote = async () => {
        if (title.trim() === '' || content.trim() === '') return;
        await insertNoteWithTags(title, content, 'active', selectedTags);
        navigation.goBack();
    };

    const handleRemoveTag = (tagId: number) => {
        setSelectedTags((prev) => prev.filter((id) => id !== tagId));
    };

    // Handle adding a selected tag from the modal
    const handleTagAdded = (tagId: number) => {
        setSelectedTags((prev) => [...prev, tagId]);
        setIsTagModalVisible(false); // Close modal after adding tag
    };

    return (
        <StyledScrollView className="flex-1 p-4 bg-white">
            {/* Title */}
            <StyledText className="text-xl font-bold text-center mb-4">Add New Note</StyledText>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
                <StyledView className="flex-row flex-wrap mb-4 w-full">
                    <FlatList
                        data={selectedTags}
                        horizontal
                        renderItem={({ item }) => {
                            const tag = availableTags.find((tag) => tag.id === item.toString());
                            return tag ? (
                                <StyledView
                                    key={tag.id}
                                    className="flex-row items-center bg-blue-200 px-2 py-1 mr-2 mb-2 rounded"
                                >
                                    <StyledText className="mr-2">{tag.title}</StyledText>
                                    <StyledTouchableOpacity onPress={() => handleRemoveTag(Number(tag.id))}>
                                        <StyledText className="text-red-500">x</StyledText>
                                    </StyledTouchableOpacity>
                                </StyledView>
                            ) : null;
                        }}
                        keyExtractor={(item) => item.toString()}
                    />
                </StyledView>
            )}

            {/* Add Tag Button */}
            <StyledTouchableOpacity
                className="p-2 bg-gray-200 rounded mb-4 w-full"
                onPress={() => setIsTagModalVisible(true)} // Open the tag modal
            >
                <StyledText className="text-center text-blue-500">+ Add Tag</StyledText>
            </StyledTouchableOpacity>

            {/* Content Input */}
            <StyledTextInput
                placeholder="Title"
                className="border p-2 mb-4 rounded w-full"
                value={title}
                onChangeText={setTitle}
            />

            {/* Save and Cancel Buttons */}
            <StyledView className="flex-row justify-between w-full mt-4">
                <StyledTouchableOpacity
                    className="flex-1 p-4 bg-gray-400 rounded mr-2"
                    onPress={() => navigation.goBack()}
                >
                    <StyledText className="text-white text-center">Cancel</StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                    className="flex-1 p-4 bg-blue-500 rounded ml-2"
                    onPress={handleSaveNote}
                >
                    <StyledText className="text-white text-center">Save Note</StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            {/* Tag Modal */}
            <TagModal
                visible={isTagModalVisible}
                onClose={() => setIsTagModalVisible(false)}
                onTagAdded={handleTagAdded}
                availableTags={availableTags}
            />
        </StyledScrollView>
    );
};

export default AddNoteScreen;
