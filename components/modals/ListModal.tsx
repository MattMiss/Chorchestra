import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import DraggableList from '@/components/DraggableList';
import { DraggableListItem } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ListModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    addText: string;
    items: DraggableListItem[];
    onAddNewItem: () => void;
    onUpdateItem: (id: string, newText: string) => void;
    onReorderItems: (newData: DraggableListItem[]) => void;
    onDeleteItem: (id: string) => void;
}

const ListModal: React.FC<ListModalProps> = ({
                                                 visible,
                                                 onClose,
                                                 title,
                                                 addText,
                                                 items,
                                                 onAddNewItem,
                                                 onUpdateItem,
                                                 onReorderItems,
                                                 onDeleteItem,
                                             }) => {
    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}

            // Remove the customBackdrop prop
        >

            <StyledView className="w-full p-4 bg-gray-900 min-h-[500]">
                <GestureHandlerRootView style={{ flex: 1 }}>
                    {/* Title */}
                    <StyledText className="text-3xl text-gray-500">{title}</StyledText>

                    {/* Draggable List */}
                    <DraggableList
                        items={items}
                        onReorder={onReorderItems}
                        onUpdate={onUpdateItem}
                        onDelete={onDeleteItem}
                    />

                    {/* Add New Item Button */}
                    <StyledTouchableOpacity onPress={onAddNewItem} className="flex flex-row items-center mt-4 pl-6">
                        <AntDesign name="plus" size={20} color="white" />
                        <StyledText className="text-white ml-4">{`Add ${addText}`}</StyledText>
                    </StyledTouchableOpacity>
                </GestureHandlerRootView>
            </StyledView>
        </Modal>
    );
};

export default ListModal;
