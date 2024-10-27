import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import ThemedScreen from "@/components/common/ThemedScreen";
import ColorPickerModal from "@/components/modals/ColorPickerModal";
import { styled } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import AddEditTagModal from "@/components/modals/AddEditTagModal";
import { Tag } from "@/types";
import { sortTagsByName } from "@/utils/helpers";
import { TagManagerListItem, TagManagerHiddenListItem } from "@/components/tags/TagManagerListItem";
import { SwipeListView } from "react-native-swipe-list-view";
import { Colors } from "@/constants/Colors";
import { useTagsContext } from "@/context/TagsContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TagManagerScreen = () => {
    const [isColorModalVisible, setIsColorModalVisible] = useState(false);
    const [isAddEditTagModalVisible, setIsAddEditTagModalVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const { tags, editTag, deleteTag } = useTagsContext();

    // Open color picker modal for a specific tag
    const handlePickColor = (tag: Tag) => {
        setSelectedTag(tag);
        setIsColorModalVisible(true);
    };

    const handleClosePickColor = () => {
        setIsColorModalVisible(false);
    };

    // Handle color selection from the modal
    const handleColorSelected = (color: string) => {
        if (selectedTag) {
            editTag({ ...selectedTag, color });
        }
        handleClosePickColor();
    };

    const handleOpenTagModal = () => {
        setSelectedTag(null);
        setIsAddEditTagModalVisible(true);
    };

    const handleCloseTagModal = () => {
        setIsAddEditTagModalVisible(false);
    };

    const handleTagSelected = (tag: Tag) => {
        setSelectedTag(tag);
        setIsAddEditTagModalVisible(true);
    };

    // Sort tags before rendering
    const sortedTags = sortTagsByName(tags ?? []);

    // Prepare data for SwipeListView (ensure each item has a unique key)
    const swipeListData = sortedTags.map(tag => ({
        ...tag,
        key: tag.id.toString(), // Ensure key is a string
    }));

    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={false}
            headerTitle={'#Tags'}
        >
            <StyledView className="px-2 flex-1">
                <StyledView className="p-4">
                    {/* Swipeable List for Tags */}
                    <SwipeListView
                        data={swipeListData}
                        renderItem={({ item }) => (
                            <TagManagerListItem tag={item} onEdit={handleTagSelected} onPickColor={handlePickColor} />
                        )}
                        renderHiddenItem={({ item }) => (
                            <TagManagerHiddenListItem tag={item} onDelete={() => deleteTag(item.id)} />
                        )}
                        rightOpenValue={-75} // Width of the hidden delete button
                        disableRightSwipe
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={
                            <StyledView className="flex-1 justify-center items-center">
                                <StyledText className="text-secondary">No tags available.</StyledText>
                            </StyledView>
                        }
                    />
                </StyledView>

                {/* Color Picker Modal */}
                <ColorPickerModal
                    tag={selectedTag}
                    visible={isColorModalVisible}
                    onClose={handleClosePickColor}
                    onSelectColor={handleColorSelected}
                />

                {/* Add/Edit Tag Modal */}
                <AddEditTagModal
                    visible={isAddEditTagModalVisible}
                    onClose={handleCloseTagModal}
                    availableTags={tags}
                    selectedTag={selectedTag}
                />
            </StyledView>

            <StyledView className="absolute right-4 bottom-4">
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 rounded-full"
                    onPress={handleOpenTagModal}
                    activeOpacity={0.7}
                    accessibilityLabel="Add new entry"
                    style={{ backgroundColor: Colors.buttonAlternative }}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </StyledTouchableOpacity>
            </StyledView>
        </ThemedScreen>
    );
};

export default TagManagerScreen;
