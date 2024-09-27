import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import { debounce } from 'lodash';
import {useDataContext} from "@/context/DataContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TagModalProps {
    visible: boolean;
    onClose: () => void;
    onTagAdded: (tag: Tag) => void; // Pass the full TagItem object instead of just id
    availableTags: Tag[];
}

const TagModal = ({ visible, onClose, onTagAdded, availableTags }: TagModalProps) => {
    const [tagToAdd, setTagToAdd] = useState<Tag | null>(null); // Use TagItem for selected tag
    const [tagInput, setTagInput] = useState('');
    const [suggestionsList, setSuggestionsList] = useState<Tag[] | null>(null); // Use TagItem for suggestions
    const [loading, setLoading] = useState(false);

    const {setTags, isLoading} = useDataContext();

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
                tag.name?.toLowerCase().includes(filterToken)
            );

            // Add a "Create new tag" option if no matching tags are found
            if (filteredTags.length === 0) {
                setSuggestionsList([{ id: -1, name: `Create new tag "${query}"`, color: '' }]); // Use id -1 for new tags
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
            onTagAdded(saveNewTag());
        } else if (tagToAdd) {
            // If an existing tag is selected, pass the full TagItem object
            onTagAdded(tagToAdd);
        } else if (tagInput.trim() !== ''){
            // Fallback: If no tag is selected but input is provided, create a new tag
            onTagAdded(saveNewTag());
        }
    };

    const saveNewTag = (): Tag => {
        const newTag: Tag = { id: Date.now(), name: tagInput.trim() };
        setTags((prevTags) => [...prevTags, newTag]);
        return newTag;
    }


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
                                        title: tag.name
                                    })) || []} // Convert TagItem array to AutocompleteDropdownItem array
                                    onSelectItem={(item) => {
                                        console.log(item);
                                        if (item) {
                                            if (item.id === '-1' && item.title?.startsWith('Create new tag ')) {
                                                const cleanedTag = item.title.replace('Create new tag ', '').replace(/['"]+/g, '');
                                                setTagToAdd({ id: -1, name: cleanedTag });
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

                                {/* Add/Create TagItem Button */}
                                <StyledTouchableOpacity
                                    className="p-2 bg-green-500 rounded my-4"
                                    onPress={handleAddTag}
                                    disabled={!tagInput.trim()}
                                >
                                    <StyledText className="text-white text-center">
                                        {tagToAdd?.id === -1 ? `Create and Add "${tagInput}"` : 'Add TagItem'}
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
