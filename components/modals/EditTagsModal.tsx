import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { Tag } from '@/types';
import { debounce } from 'lodash';
import { useTagsContext } from "@/context/TagsContext"; // Update to use TagsContext
import TagSearchResultItem from "@/components/tags/TagSearchResultItem";
import { sortTagsByName } from '@/utils/helpers';
import { Colors } from "@/constants/Colors";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";

interface TagWithAvailability extends Tag {
    isAvailable: boolean;
}

const StyledView = styled(View);

interface TagModalProps {
    visible: boolean;
    onClose: () => void;
    onTagAdded: (tag: Tag) => void;
    selectedTags: Tag[];
}

const EditTagsModal = ({ visible, onClose, onTagAdded, selectedTags }: TagModalProps) => {
    const [tagInput, setTagInput] = useState('');
    const [suggestionsList, setSuggestionsList] = useState<TagWithAvailability[]>([]);
    const [loading, setLoading] = useState(false);

    const { tags, addTag } = useTagsContext(); // Use TagsContext to get tags and saveTag function

    useEffect(() => {
        handleClearTag();
    }, [visible]);

    const createTagWithAvailabilityList = (tags: Tag[]): TagWithAvailability[] => {
        return tags.map((tag) => ({
            ...tag,
            isAvailable: !selectedTags.some((selectedTag) => selectedTag.id === tag.id),
        }));
    };

    const debouncedGetTagSuggestions = useCallback(
        debounce((query: string) => {
            const filterToken = query.trim().toLowerCase();
            if (query.length < 1) {
                setSuggestionsList(createTagWithAvailabilityList(tags));
                return;
            }
            setLoading(true);

            const filteredTags = tags.filter((tag) =>
                tag.name?.toLowerCase().includes(filterToken)
            );

            if (filteredTags.length === 0) {
                setSuggestionsList([{ id: -1, name: query.trim(), color: '', isAvailable: true }]);
            } else {
                const updatedTags = createTagWithAvailabilityList(filteredTags);
                setSuggestionsList(updatedTags);
            }

            setLoading(false);
        }, 300),
        [tags, selectedTags]
    );

    const handleInputChange = useCallback((text: string) => {
        setTagInput(text);
        debouncedGetTagSuggestions(text);
    }, [debouncedGetTagSuggestions]);

    const handleClearTag = useCallback(() => {
        setTagInput('');
        setSuggestionsList(createTagWithAvailabilityList(tags));
    }, [tags, selectedTags]);

    const handleSaveNewTag = (): Tag => {
        const newTag: Tag = { id: Date.now(), name: tagInput.trim() };
        addTag(newTag); // Use saveTag from TagsContext to persist the new tag
        return newTag;
    };

    const handleTagSelected = (tag: Tag) => {
        if (tag.id === -1) {
            const tagWithID = handleSaveNewTag();
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
                onPressOut={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                        <TouchableWithoutFeedback>
                            <StyledView className={`p-4 w-full max-w-md min-h-[75%] rounded-t-3xl bg-medium`}>
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
