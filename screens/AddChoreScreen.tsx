import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';  // Import useRouter from Expo Router
import TextInputFloatingLabel from "@/components/TextInputFloatingLabel";
import Container from '@/components/Container';
import ListModal from "@/components/modals/ListModal";
import {DraggableListItem, FrequencyType, PriorityLevel, priorityOptions, Tag} from '@/types';
import ThemedScreen from "@/components/ThemedScreen";
import 'react-native-get-random-values';
import { v4 as getRandomId } from 'uuid';
import {AntDesign} from "@expo/vector-icons";
import PrioritySelector from "@/components/PrioritySelector";
import FrequencySelector from "@/components/FrequencySelector";
import TagModal from "@/components/modals/TagModal";
import {SQLRows} from "@/database/types";
import {getAllTags} from "@/database/database";

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddChoreScreen = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState<DraggableListItem[]>([]);
    const [itemsNeeded, setItemsNeeded] = useState<DraggableListItem[]>([]);
    const [frequency, setFrequency] = useState<number>(1); // Default frequency
    const [frequencyType, setFrequencyType] = useState<FrequencyType>('day');
    const [priority, setPriority] = useState<PriorityLevel>(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [isListModalVisible, setIsListModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalAddText, setModalAddText] = useState('');
    const [modalItems, setModalItems] = useState<DraggableListItem[]>([]); // Holds instructions or itemsNeeded
    const [modalItemKey, setModalItemKey] = useState<string>('instructions');

    const router = useRouter();  // Using Expo Router for navigation

    useEffect(() => {
        void fetchTags();
    }, []);

    useEffect(() => {
        console.log('Selected Tags: ', selectedTags);
    }, [selectedTags]);

    const fetchTags = async () => {
        const tags: SQLRows = await getAllTags();
        console.log("Tags: ", tags);
        setAvailableTags(
            tags.map((tag) => ({
                id: tag.id,
                title: tag.name || '', // Ensure title is always a string, fallback to empty string
            }))
        );
    };

    // Open the modal for either Instructions or Items Needed
    const openModal = (key: string, title: string, addText: string, items: DraggableListItem[]) => {
        setModalItemKey(key);
        setModalTitle(title);
        setModalAddText(addText);
        setModalItems(items);
        setIsListModalVisible(true);
    };

    const handleModalClose = () => {
        if(modalItemKey === 'instructions'){
            setInstructions(modalItems);
        }else if (modalItemKey === 'items'){
            setItemsNeeded(modalItems);
        }
        setIsListModalVisible(false);
        setModalItems([]);
        setModalTitle('');
        setModalAddText('');
    };

    const handleAddNewItem = () => {
        setModalItems([...modalItems, { id: getRandomId(), text: '' }]);
    };

    const handleItemsUpdate = (id: string, newText: string) => {
        setModalItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, text: newText } : item
            )
        );
    };

    const handleItemsReorder = (newData: DraggableListItem[]) => {
        setModalItems(newData);
    };

    const handleItemsDelete = (id: string) => {
        setModalItems(modalItems.filter(item => item.id !== id));
    };

    const handleSaveChore = () => {
        if (name.trim() === '' || description.trim() === '') return;
        // Save chore logic goes here (you can send data to an API or storage)
        router.back();  // Use router to go back after saving
    };

    const handleTagAdded = (newTag: Tag) => {
        if (!selectedTags.some(tag => tag.id === newTag.id)) {
            setSelectedTags([...selectedTags, newTag]);
        } else {
            alert(`${newTag.title} already exists`);
        }
        setIsTagModalVisible(false);
    };

    const handleRemoveTag = (tagId: number) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
    };

    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            headerTitle={"Add Chore"}
        >
            <StyledScrollView
                className="p-2 flex-grow"
                contentContainerStyle={{ paddingBottom: 30 }} // Adjust the value as needed
            >
                {/* Name and Description */}
                <Container>
                    <TextInputFloatingLabel
                        autoFocus={true}
                        label="Chore Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInputFloatingLabel
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                    />
                </Container>

                {/* Instructions and Items Needed Summary */}
                <Container>
                    <StyledTouchableOpacity className='flex-row items-center min-h-[50]' onPress={() => openModal('instructions', 'Instructions', 'Instruction', instructions)}>
                        <StyledText className="flex-grow text-xl text-gray-400">
                            {instructions.length > 0 ? instructions.length : 'No'} Instructions
                        </StyledText>
                        <StyledView className='py-1 pl-5 pr-2'>
                            <AntDesign name="form" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                <Container>
                    <StyledTouchableOpacity className='flex-row items-center min-h-[50]' onPress={() => openModal('items', 'Items Needed', 'Item', itemsNeeded)}>
                        <StyledText className="flex-grow text-xl text-gray-400">
                            {itemsNeeded.length > 0 ? itemsNeeded.length : 'No'} Items Needed
                        </StyledText>
                        <StyledView className='py-1 pl-5 pr-2'>
                            <AntDesign name="form" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                {/* Frequency and Priority Fields */}
                <Container>
                    <FrequencySelector
                        frequencyNumber={frequency}
                        setFrequencyNumber={setFrequency}
                        frequencyType={frequencyType}
                        setFrequencyType={setFrequencyType}
                    />
                </Container>

                <Container>
                    <PrioritySelector priority={priority} setPriority={setPriority} />
                </Container>

                {selectedTags.length > 0 && (
                    <StyledView className="flex-row flex-wrap mb-4 w-full">
                        <FlatList
                            data={selectedTags}
                            horizontal
                            renderItem={({ item }) => (
                                <StyledView
                                    key={item.id}
                                    className="flex-row items-center bg-blue-200 px-2 py-1 mr-2 mb-2 rounded"
                                >
                                    <StyledText className="mr-2">{item.title}</StyledText>
                                    <StyledTouchableOpacity onPress={() => handleRemoveTag(item.id)}>
                                        <StyledText className="text-red-500">x</StyledText>
                                    </StyledTouchableOpacity>
                                </StyledView>
                            )}
                            keyExtractor={(item) => item.id.toString()}
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

                <StyledView className="mb-10">
                    {/* Save Button */}
                    <StyledTouchableOpacity onPress={handleSaveChore} className="bg-blue-500 my-4 p-3 rounded-lg">
                        <StyledText className="text-white text-center">Save Chore</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>


            </StyledScrollView>
            {/* Modular Modal */}
            <ListModal
                visible={isListModalVisible}
                onClose={handleModalClose}
                title={modalTitle}
                addText={modalAddText}
                items={modalItems}
                onAddNewItem={handleAddNewItem}
                onUpdateItem={handleItemsUpdate}
                onReorderItems={handleItemsReorder}
                onDeleteItem={handleItemsDelete}
            />
            <TagModal
                visible={isTagModalVisible}
                onClose={() => setIsTagModalVisible(false)}
                onTagAdded={handleTagAdded}
                availableTags={availableTags}
            />
        </ThemedScreen>
    );
};

export default AddChoreScreen;
