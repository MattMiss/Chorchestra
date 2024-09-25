import React from 'react';
import { SafeAreaView } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import ListItem from './ListItem';
import { DraggableListItem } from '@/types';

type DraggableListProps = {
    items: DraggableListItem[];
    onReorder: (newData: DraggableListItem[]) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, newText: string) => void;  // New prop to handle item text updates
};

const DraggableList: React.FC<DraggableListProps> = ({ items, onReorder, onDelete, onUpdate }) => {
    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<DraggableListItem>) => {

        const index = getIndex();
        return (
            <ListItem
                item={item}
                drag={drag}
                isActive={isActive}
                index={index}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
        );
    };

    return (
        <DraggableFlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={({ data }) => onReorder(data)}  // Handle the reorder
            onDragBegin={() => console.log("Dragging now")}
        />
    );
};

export default DraggableList;
