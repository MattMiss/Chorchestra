import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import { debounce } from 'lodash';
import { useDataContext } from "@/context/DataContext";
import TagSearchResultItem from "@/components/tags/TagSearchResultItem";
import { sortTagsByName } from '@/utils/helpers';
import {Colors} from "@/constants/Colors";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";

// New Interface extending Tag with `isAvailable` field
interface TagWithAvailability extends Tag {
    isAvailable: boolean;
}

const StyledView = styled(View);

interface TagModalProps {
    visible: boolean;
    onClose: () => void;
    onTagAdded: (tag: Tag) => void; // Pass the full Tag object instead of just id
    selectedTags: Tag[];
    availableTags: Tag[];
}

const EditTagsModal = ({ visible, onClose, onTagAdded, selectedTags, availableTags }: TagModalProps) => {
    const [tagInput, setTagInput] = useState('');
    const [suggestionsList, setSuggestionsList] = useState<TagWithAvailability[]>([]); // Use TagWithAvailability array for suggestions
    const [loading, setLoading] = useState(false);

    const { setTags, isLoading } = useDataContext();

    useEffect(() => {
        console.log("SELECTED: ", selectedTags);
    }, [selectedTags]);

    useEffect(() => {
        handleClearTag();
    }, [visible]);

    // Create TagWithAvailability array from availableTags and selectedTags
    const createTagWithAvailabilityList = (tags: Tag[]): TagWithAvailability[] => {
        return tags.map((tag) => ({
            ...tag,
            isAvailable: !selectedTags.some((selectedTag) => selectedTag.id === tag.id), // Set isAvailable based on whether the tag is in selectedTags
        }));
    };

    // Memoized function for suggestions
    const debouncedGetTagSuggestions = useCallback(
        debounce((query: string) => {
            const filterToken = query.trim().toLowerCase();
            if (query.length < 1) {
                setSuggestionsList(createTagWithAvailabilityList(availableTags));
                return;
            }
            setLoading(true);

            const filteredTags = availableTags.filter((tag) =>
                tag.name?.toLowerCase().includes(filterToken)
            );

            // Add a "Create new tag" option if no matching tags are found
            if (filteredTags.length === 0) {
                setSuggestionsList([{ id: -1, name: query.trim(), color: '', isAvailable: true }]); // Use id -1 for new tags
            } else {
                const updatedTags = createTagWithAvailabilityList(filteredTags);
                setSuggestionsList(updatedTags);
            }

            setLoading(false);
        }, 300),
        [availableTags, selectedTags]
    );

    const handleInputChange = useCallback((text: string) => {
        setTagInput(text);
        debouncedGetTagSuggestions(text);
    }, [debouncedGetTagSuggestions]);

    const handleClearTag = useCallback(() => {
        setTagInput('');
        setSuggestionsList(createTagWithAvailabilityList(availableTags)); // Create the suggestions list with availability check
    }, [availableTags, selectedTags]);

    const saveNewTag = (): Tag => {
        const newTag: Tag = { id: Date.now(), name: tagInput.trim() };
        setTags((prevTags) => {
            const updatedTags = [newTag, ...prevTags];
            return sortTagsByName(updatedTags);
        });

        return newTag;
    };

    const handleTagSelected = (tag: Tag) => {
        if (tag.id === -1) {
            const tagWithID = saveNewTag();
            onTagAdded(tagWithID);
        } else {
            onTagAdded(tag);
        }
        setTagInput('');
    };

    const memoizedSuggestionsList = useMemo(() => suggestionsList, [suggestionsList]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPressOut={onClose} // This only triggers when clicking outside the modal content
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                        <TouchableWithoutFeedback>
                            <StyledView className={`p-4 w-full max-w-md min-h-[75%] rounded-t-3xl bg-[${Colors.backgroundMedium}]`}>
                                <StyledView className="flex-1">
                                    <StyledView className="w-full p-3">
                                        <TextInputFloatingLabel label='Search for a tag' value={tagInput} onChangeText={handleInputChange} />
                                    </StyledView>

                                    <StyledView className="px-2">
                                        <FlatList<TagWithAvailability>
                                            data={memoizedSuggestionsList}
                                            renderItem={({ item }) => (
                                                <TagSearchResultItem
                                                    tag={item}
                                                    isAvailable={item.isAvailable}
                                                    onTagSelected={handleTagSelected}
                                                />
                                            )}
                                            keyExtractor={(item) => item.id.toString()}
                                            style={{ marginBottom: 10 }}
                                        />
                                    </StyledView>
                                </StyledView>
                            </StyledView>
                        </TouchableWithoutFeedback>
                    </StyledView>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default EditTagsModal;
