import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { AntDesign } from '@expo/vector-icons'; // Import the AntDesign icon

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ListInputProps {
    placeholder: string;             // Placeholder for the input
    onSubmit: (value: string) => void;  // Submit handler that sends the value to the parent
}

const ListInput: React.FC<ListInputProps> = ({ placeholder, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');  // Internal state for input

    const handleInputSubmit = () => {
        if (inputValue.trim() !== '') {
            onSubmit(inputValue);  // Send value to the parent
            setInputValue('');     // Clear the input after submission
        }
    };

    return (
        <StyledView className='flex flex-row items-center'>
            {/* Input field */}
            <StyledView className='flex-grow mr-2'>
                <StyledTextInput
                    placeholder={placeholder}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={handleInputSubmit}
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }}
                />
            </StyledView>

            {/* Circular button with AntDesign plus icon */}
            <StyledView className='w-10 h-10'>
                <StyledTouchableOpacity
                    onPress={handleInputSubmit}
                    className='bg-blue-600 justify-center rounded-full items-center h-full'
                >
                    <AntDesign name="plus" size={24} color="white" />
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
};

export default ListInput;
