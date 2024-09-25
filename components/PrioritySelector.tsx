import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styled } from 'nativewind';
import { PriorityLevel, priorityOptions } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPicker = styled(Picker);

const priorityColors: Record<PriorityLevel, string> = {
    3: "#a42b2b", // Example color for high priority
    2: "#b7b72d", // Example color for medium priority
    1: "#26c526", // Example color for low priority
};

const PrioritySelector = ({
                              priority,
                              setPriority,
                          }: {
    priority: PriorityLevel;
    setPriority: (value: PriorityLevel) => void;
}) => {
    const selectedTextColor = priorityColors[priority];
    return (
        <StyledView className="flex-row items-center justify-between py-1">
            {/* Label */}
            <StyledText className="flex-1 text-xl text-gray-400">Priority</StyledText>

            {/* Picker Container */}
            <StyledView className="flex-1 p-1">
                <StyledPicker
                    className="rounded-lg"
                    selectedValue={priority}
                    onValueChange={(value) => setPriority(value as PriorityLevel)}
                    mode={'dropdown'}
                    dropdownIconColor="white"
                    style={{
                        color: selectedTextColor,
                    }}
                >
                    {priorityOptions.map((option) => {
                        const pickerTextColor = priorityColors[option.value as PriorityLevel];
                        return (
                            <Picker.Item
                                key={option.value}
                                label={option.label}
                                value={option.value}
                                style={{
                                    backgroundColor: '#030712',
                                    color: pickerTextColor,
                                    fontSize: 20,
                                }}
                            />
                        );
                    })}
                </StyledPicker>
            </StyledView>
        </StyledView>
    );
};

export default PrioritySelector;
