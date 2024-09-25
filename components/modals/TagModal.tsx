import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { styled } from 'nativewind';
import { Tag } from '@/types'; // Import the Tag interface
import { debounce } from 'lodash';
import { createTag } from '@/database/database'; // Import createTag function to add new tags

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TagModalProps {
    visible: boolean;
    onClose: () => void;
    onTagAdded: (tag: Tag) => void; // Pass the full Tag object instead of just id
    availableTags: Tag[];
}


const TagModal = ({ visible, onClose, onTagAdded, availableTags }: TagModalProps) => {
    const [tagToAdd, setTagToAdd] = useState<Tag | null>(null); // Use Tag for selected tag
    const [tagInput, setTagInput] = useState('');
    const [suggestionsList, setSuggestionsList] = useState<Tag[] | null>(null); // Use Tag for suggestions
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleClearTag();
    }, [visible]);

    // Memoized function for suggestions
    const debouncedGetTagSuggestions = useCallback(
        debounce((query: string) => {
            const filterToken = query.toLowerCase();
            if (query.length < 2) {
                setSuggestionsList(null);
                return;
            }
            setLoading(true);

            const filteredTags = availableTags.filter((tag) =>
                tag.title?.toLowerCase().includes(filterToken)
            );

            // Add a "Create new tag" option if no matching tags are found
            if (filteredTags.length === 0) {
                setSuggestionsList([{ id: -1, title: `Create new tag "${query}"` }]); // Use id -1 for new tags
            } else {
                setSuggestionsList(filteredTags);
            }

            setLoading(false);
        }, 300),
        [availableTags]
    );

    const handleInputChange = useCallback((text: string) => {
        setTagInput(text);
        debouncedGetTagSuggestions(text);
    }, [debouncedGetTagSuggestions]);

    const handleClearTag = useCallback(() => {
        setTagToAdd(null);
        setTagInput('');
        setSuggestionsList(null);
    }, []);

    const handleAddTag = async () => {
        if (tagToAdd?.id === -1) {
            // Create a new tag if the "Create new tag" option is selected
            const newTagResult = await createTag(tagInput.trim());
            if (newTagResult && newTagResult.lastInsertRowId) {
                const newTag: Tag = { id: newTagResult.lastInsertRowId, title: tagInput.trim() };
                onTagAdded(newTag); // Pass the full Tag object to the parent
            }
        } else if (tagToAdd) {
            // If an existing tag is selected, pass the full Tag object
            onTagAdded(tagToAdd);
        } else if (tagInput.trim() !== '') {
            // Fallback: If no tag is selected but input is provided, create a new tag
            const newTagResult = await createTag(tagInput.trim());
            if (newTagResult && newTagResult.lastInsertRowId) {
                const newTag: Tag = { id: newTagResult.lastInsertRowId, title: tagInput.trim() };
                onTagAdded(newTag);
            }
        }
    };


    const memoizedSuggestionsList = useMemo(() => suggestionsList, [suggestionsList]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <AutocompleteDropdownContextProvider>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPressOut={onClose}
                >
                    <StyledView className="flex-1 justify-center items-center bg-transparent-70 p-4">
                        <TouchableWithoutFeedback>
                            <StyledView className="w-full bg-white p-4 rounded-lg">
                                <AutocompleteDropdown
                                    dataSet={memoizedSuggestionsList?.map(tag => ({
                                        id: tag.id.toString(),
                                        title: tag.title
                                    })) || []} // Convert Tag array to AutocompleteDropdownItem array
                                    onSelectItem={(item) => {
                                        if (item) {
                                            if (item.id === '-1' && item.title?.startsWith('Create new tag ')) {
                                                const cleanedTag = item.title.replace('Create new tag ', '').replace(/['"]+/g, '');
                                                setTagToAdd({ id: -1, title: cleanedTag });
                                                setTagInput(cleanedTag);
                                            } else {
                                                const selectedTag = availableTags.find(tag => tag.id.toString() === item.id);
                                                setTagToAdd(selectedTag || null);
                                                setTagInput(item.title ?? '');
                                            }
                                        }
                                    }}
                                    onChangeText={handleInputChange}
                                    onClear={handleClearTag}
                                    loading={loading}
                                    textInputProps={{
                                        placeholder: 'Search or create tags...',
                                        autoCorrect: false,
                                        autoCapitalize: 'none',
                                        value: tagInput,
                                        style: {
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            padding: 10,
                                            borderRadius: 5,
                                        },
                                    }}
                                    showClear={true}
                                    suggestionsListMaxHeight={300}
                                    inputHeight={50}
                                />

                                {/* Add/Create Tag Button */}
                                <StyledTouchableOpacity
                                    className="p-2 bg-green-500 rounded my-4"
                                    onPress={handleAddTag}
                                    disabled={!tagInput.trim()}
                                >
                                    <StyledText className="text-white text-center">
                                        {tagToAdd?.id === -1 ? `Create and Add "${tagInput}"` : 'Add Tag'}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        </TouchableWithoutFeedback>
                    </StyledView>
                </TouchableOpacity>
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
};

export default TagModal;
