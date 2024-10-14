import React from 'react';
import { View, Text, TouchableOpacity, ModalProps } from 'react-native';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import DraggableList from '@/components/common/DraggableList';
import { DraggableListItem } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ListModalProps extends ModalProps  {
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
                                                 ...rest
                                             }) => {
    return (
        // @ts-ignore
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            {...rest}
        >

            <StyledView className={`p-4 w-full min-h-[500] bg-[${Colors.backgroundMedium}]`}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    {/* Title */}
                    <StyledText className={`text-3xl text-[${Colors.textSecondary}]`}>{title}</StyledText>

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
                        <StyledText className={`ml-4 text-[${Colors.textPrimary}]`}>{`Add ${addText}`}</StyledText>
                    </StyledTouchableOpacity>
                </GestureHandlerRootView>
            </StyledView>
        </Modal>
    );
};

export default ListModal;
