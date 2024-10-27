import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";
import Container from '@/components/common/Container';
import ListModal from "@/components/modals/ListModal";
import { DraggableListItem, EstTimeType, FrequencyType, PriorityLevel, Tag } from '@/types';
import ThemedScreen from "@/components/common/ThemedScreen";
import 'react-native-get-random-values';
import { v4 as getRandomId } from 'uuid';
import { AntDesign } from "@expo/vector-icons";
import PrioritySelector from "@/components/chores/PrioritySelector";
import FrequencySelector from "@/components/chores/FrequencySelector";
import { useChoresContext } from "@/context/ChoresContext";
import { useTagsContext } from "@/context/TagsContext";
import TagSelector from "@/components/chores/TagSelector";
import EditTagsModal from "@/components/modals/EditTagsModal";
import EstTimeSelector from "@/components/chores/EstTimeSelector";
import { Colors } from "@/constants/Colors";

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddEditChoreScreen = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState<DraggableListItem[]>([]);
    const [itemsNeeded, setItemsNeeded] = useState<DraggableListItem[]>([]);
    const [estTime, setEstTime] = useState<number>(1);
    const [estTimeType, setEstTimeType] = useState<EstTimeType>('minute');
    const [frequency, setFrequency] = useState<number>(1);
    const [frequencyType, setFrequencyType] = useState<FrequencyType>('day');
    const [priority, setPriority] = useState<PriorityLevel>(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [isListModalVisible, setIsListModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalAddText, setModalAddText] = useState('');
    const [modalItems, setModalItems] = useState<DraggableListItem[]>([]);
    const [modalItemKey, setModalItemKey] = useState<string>('instructions');
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();
    const { chores, addChore, editChore } = useChoresContext();
    const { tags } = useTagsContext();

    // Retrieve the passed choreId from the URL parameters (as a string)
    const { choreId } = useLocalSearchParams<{ choreId?: string }>();

    useEffect(() => {
        if (choreId) {
            const choreToEdit = chores.find((chore) => chore.id.toString() === choreId);
            if (choreToEdit) {
                setName(choreToEdit.name);
                setDescription(choreToEdit.description);
                setInstructions(choreToEdit.instructions.map((text) => ({ id: getRandomId(), text })));
                setItemsNeeded(choreToEdit.itemsNeeded.map((text) => ({ id: getRandomId(), text })));
                setEstTime(choreToEdit.estTime);
                setEstTimeType(choreToEdit.estTimeType);
                setFrequency(choreToEdit.frequency);
                setFrequencyType(choreToEdit.frequencyType);
                setPriority(choreToEdit.priority);
                setSelectedTags(tags.filter((tag) => choreToEdit.tagIds.includes(tag.id)));
                setIsEditing(true);
            }
        }
    }, [choreId, chores, tags]);

    const openModal = (key: string, title: string, addText: string, items: DraggableListItem[]) => {
        setModalItemKey(key);
        setModalTitle(title);
        setModalAddText(addText);
        setModalItems(items);
        setIsListModalVisible(true);
    };

    const handleModalClose = () => {
        if (modalItemKey === 'instructions') {
            setInstructions(modalItems);
        } else if (modalItemKey === 'items') {
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
        setModalItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, text: newText } : item))
        );
    };

    const handleItemsReorder = (newData: DraggableListItem[]) => {
        setModalItems(newData);
    };

    const handleItemsDelete = (id: string) => {
        setModalItems(modalItems.filter((item) => item.id !== id));
    };

    const handleSaveChore = async () => {
        if (name.trim() === '') {
            alert('A Name is required.');
            return;
        }

        const instructionsText = instructions.map((item) => item.text.trim()).filter((text) => text !== '');
        const itemsNeededText = itemsNeeded.map((item) => item.text.trim()).filter((text) => text !== '');
        const tagIds = selectedTags.map((tag) => tag.id);

        const newChore = {
            id: isEditing && choreId ? Number(choreId) : Date.now(),
            name: name.trim(),
            description: description.trim(),
            estTime,
            estTimeType,
            frequency,
            frequencyType,
            status: 'active',
            priority,
            instructions: instructionsText,
            itemsNeeded: itemsNeededText,
            tagIds,
        };

        if (isEditing) {
            editChore(newChore);
        } else {
            addChore(newChore);
        }

        router.back();
    };

    const toggleTagModal = (showModal: boolean) => {
        setIsTagModalVisible(showModal);
    }

    const handleTagAdded = (newTag: Tag) => {
        if (!selectedTags.some((tag) => tag.id === newTag.id)) {
            setSelectedTags((prevSelectedTags) => [...prevSelectedTags, newTag]);
        } else {
            alert(`${newTag.name} is already selected`);
        }
        toggleTagModal(false);
    };

    const handleRemoveTag = (tagId: number) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
    };

    return (
        <ThemedScreen
            showHeaderNavButton
            showHeaderNavOptionButton
            headerTitle={isEditing ? 'Edit Chore' : 'Add Chore'}
        >
            <StyledScrollView className="p-2 flex-grow" contentContainerStyle={{ paddingBottom: 30 }}>
                <Container>
                    <TextInputFloatingLabel label="Chore Name" value={name} onChangeText={setName} />
                    <TextInputFloatingLabel label="Description" value={description} onChangeText={setDescription} />
                </Container>

                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={() => openModal('instructions', 'Instructions', 'Instruction', instructions)}
                    >
                        <StyledText className="flex-grow text-xl text-secondary">
                            {instructions.length > 0 ? instructions.length : 'No'} Instructions
                        </StyledText>
                        <StyledView className="py-1 pl-5 pr-2">
                            <AntDesign name="form" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={() => openModal('items', 'Items Needed', 'Item', itemsNeeded)}
                    >
                        <StyledText className="flex-grow text-xl text-secondary">
                            {itemsNeeded.length > 0 ? itemsNeeded.length : 'No'} Items Needed
                        </StyledText>
                        <StyledView className="py-1 pl-5 pr-2">
                            <AntDesign name="form" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                <Container>
                    <StyledView className="py-2">
                        <EstTimeSelector estTime={estTime} setEstTime={setEstTime} timeType={estTimeType} setTimeType={setEstTimeType} />
                    </StyledView>
                    <StyledView className="pt-1">
                        <FrequencySelector frequencyNumber={frequency} setFrequencyNumber={setFrequency} frequencyType={frequencyType} setFrequencyType={setFrequencyType} />
                    </StyledView>
                    <PrioritySelector priority={priority} setPriority={setPriority} />
                </Container>

                <Container>
                    <TagSelector canRemoveTags={true} selectedTags={selectedTags} onRemoveTag={handleRemoveTag} onToggleModal={toggleTagModal} />
                </Container>

                <StyledView className="mb-10">
                    <StyledTouchableOpacity
                        onPress={handleSaveChore}
                        className="my-4 p-3 rounded-lg"
                        style={{ backgroundColor: Colors.buttonPrimary }}
                    >
                        <StyledText className="text-center text-primary">
                            {isEditing ? 'Save Changes' : 'Save Chore'}
                        </StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledScrollView>

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
            <EditTagsModal
                visible={isTagModalVisible}
                onClose={() => toggleTagModal(false)}
                onTagAdded={handleTagAdded}
                selectedTags={selectedTags}
            />
        </ThemedScreen>
    );
};

export default AddEditChoreScreen;
