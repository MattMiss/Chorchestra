import {useCallback, useState} from "react";
import {FlatList, TouchableOpacity, View, Text} from "react-native";
import ThemedScreen from "@/components/common/ThemedScreen";
import TagItem from "@/components/tags/TagItem";
import ColorPickerModal from "@/components/modals/ColorPickerModal";
import {useDataContext} from "@/context/DataContext";
import {styled} from "nativewind";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import AddEditTagModal from "@/components/modals/AddEditTagModal";
import {Tag} from "@/types";
import {sortTagsByName} from "@/utils/helpers";
import {TagManagerListItem, TagManagerHiddenListItem} from "@/components/tags/TagManagerListItem";
import SwipeableTagListItem from "@/components/tags/SwipeableTagListItem";
import {SwipeListView} from "react-native-swipe-list-view";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const TagManagerScreen = () => {
    const [isColorModalVisible, setIsColorModalVisible] = useState(false);
    const [isAddEditTagModalVisible, setIsAddEditTagModalVisible] = useState(false);
    const [currentTagId, setCurrentTagId] = useState<number | null>(null);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const {tags, setTags} = useDataContext();

    // Open color picker modal for a specific tag
    const handlePickColor = (tag: Tag) => {
        setSelectedTag(tag);
        setIsColorModalVisible(true);
    };

    const handleClosePickColor = () => {
        setCurrentTagId(null);
        setIsColorModalVisible(false);
    };

    // Handle color selection from the modal
    const handleColorSelected = (color: string) => {
        setTags(prevTags =>
            prevTags.map(tag =>
                tag.id === selectedTag?.id ? { ...tag, color } : tag
            )
        );
        handleClosePickColor();
    };

    const handleOpenTagModal = () => {
        setSelectedTag(null);
        setIsAddEditTagModalVisible(true);
    }

    const handleCloseTagModal = () => {
        setIsAddEditTagModalVisible(false);
    }

    const handleTagSelected = (tag: Tag) => {
        setSelectedTag(tag);
        setIsAddEditTagModalVisible(true);
    }

    const deleteTag = (tagToDelete: Tag) => {
        setTags((prevTags) => prevTags.filter(tag => tag.id !== tagToDelete.id));
    };


    // Sort tags before rendering
    const sortedTags = sortTagsByName(tags);

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
            <StyledView className="p-5">
                {/* FlatList for Tags */}
                <SwipeListView
                    data={swipeListData}
                    renderItem={({item}) => (
                        <TagManagerListItem  tag={item} onEdit={handleTagSelected} onPickColor={handlePickColor}/>
                    )}
                    renderHiddenItem={({item}) => (
                        <TagManagerHiddenListItem tag={item} onDelete={deleteTag} />
                    )}
                    rightOpenValue={-75} // Width of the hidden delete button
                    disableRightSwipe
                    // Optional: Customize the list further as needed
                    contentContainerStyle={{ paddingBottom: 100 }}
                    // Add a ListEmptyComponent if desired
                    ListEmptyComponent={
                        <StyledView className="flex-1 justify-center items-center">
                            <StyledText className="text-gray-500">No tags available.</StyledText>
                        </StyledView>
                    }
                />

                {/* Color Picker Modal */}
                <ColorPickerModal
                    tag={selectedTag}
                    visible={isColorModalVisible}
                    onClose={handleClosePickColor}
                    onSelectColor={handleColorSelected}
                />

                <AddEditTagModal
                    visible={isAddEditTagModalVisible}
                    onClose={handleCloseTagModal}
                    availableTags={tags}
                    selectedTag={selectedTag}
                />
            </StyledView>
            <StyledTouchableOpacity
                className="w-12 h-12 absolute right-10 bottom-10 bg-red-500 p-2 rounded-full justify-center items-center"
                onPress={handleOpenTagModal}
            >
                <AntDesign name='plus' size={24} color='white'/>
            </StyledTouchableOpacity>
        </ThemedScreen>
    )
}

export default TagManagerScreen;