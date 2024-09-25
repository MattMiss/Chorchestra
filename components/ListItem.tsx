import React, {useState, forwardRef, useEffect} from 'react';
import { View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { MaterialIcons } from '@expo/vector-icons';
import { DraggableListItem } from '@/types';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledPressable = styled(Pressable);

interface ListItemProps {
    item: DraggableListItem;
    drag: () => void;
    isActive: boolean;
    index: number | undefined;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string) => void; // Prop for handling item text update
}

const listStyle = {
    active: 'bg-blue-200',
    inactive: 'bg-gray-400'
}

const ListItem = forwardRef<View, ListItemProps>(({ item, drag, isActive, index, onDelete, onUpdate }, ref) => {
    const [currentText, setCurrentText] = useState(item.text);  // Track current input value

    useEffect(() => {
        console.log(isActive);
    }, [isActive]);

    const handleSaveEdit = () => {
        console.log("Saving");
        onUpdate(item.id, currentText);  // Update item with new text when focus is lost or submitted
    };

    return (
        <StyledView
            className={"flex-row items-start py-2 rounded-lg"}
            ref={ref}
        >
            {/* Left side button for dragging */}
            <StyledPressable onLongPress={drag} delayLongPress={0} className="w-8 h-8 justify-center items-center">
                <MaterialIcons name="drag-indicator" size={24} color="white" />
            </StyledPressable>

            {/* Middle text input that looks like normal text (no border) */}
            <StyledView className="flex-1 mx-2 justify-center">
                <StyledTextInput
                    value={currentText}
                    onChangeText={setCurrentText}
                    onBlur={handleSaveEdit} // Save when focus is lost
                    onSubmitEditing={handleSaveEdit} // Save on enter key press
                    className="text-lg p-0 bg-transparent text-white"
                    autoFocus={false}
                    multiline // Allow multiline input
                    blurOnSubmit={true} // Blurs the input on submit
                    returnKeyType="done" // Display 'Done' on the keyboard
                    textAlignVertical="top"
                    style={{ flexWrap: 'wrap', flex: 1 }}
                />
            </StyledView>


            {/* Delete button with fixed width */}
            <StyledTouchableOpacity
                onPress={() => onDelete(item.id)}
                className="h-8 w-8 mr-2 justify-center items-center"
            >
                <MaterialIcons name="clear" size={24} color="white" />
            </StyledTouchableOpacity>
        </StyledView>
    );
});

ListItem.displayName = 'ListItem';

export default ListItem;
