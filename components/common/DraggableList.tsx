import React from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import ListItemWithInput from './ListItemWithInput';
import { DraggableListItem } from '@/types';

type DraggableListProps = {
    items: DraggableListItem[];
    onReorder: (newData: DraggableListItem[]) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, newText: string) => void;
};

const DraggableList: React.FC<DraggableListProps> = ({ items, onReorder, onDelete, onUpdate }) => {
    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<DraggableListItem>) => {

        const index = getIndex();
        return (
            <ListItemWithInput
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
