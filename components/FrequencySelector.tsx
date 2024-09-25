import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { styled } from 'nativewind';
import { AntDesign } from '@expo/vector-icons';
import { PriorityLevel, priorityOptions } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPickerContainer = styled(View);

const PrioritySelector = ({
                               priority,
                               setPriority,
                           }: {
    priority: PriorityLevel;
    setPriority: (value: PriorityLevel) => void;
}) => {
    return (
        <StyledView className="flex-row items-center justify-between py-2">
            {/* Label */}
            <StyledText className="text-white text-2xl text-gray-400">Priority</StyledText>

            {/* Picker Container */}
            <StyledPickerContainer className="bg-gray-800 rounded">
                <RNPickerSelect
                    onValueChange={(value) => {
                        if (value !== null) {
                            setPriority(value);
                        }
                    }}
                    items={priorityOptions}
                    value={priority}
                    placeholder={{}}
                    useNativeAndroidPickerStyle={false}
                    style={{
                        inputAndroid: {
                            color: 'white',
                            fontSize: 16,
                            paddingVertical: 8,
                            paddingLeft: 10,
                            marginRight: 30
                        },
                        iconContainer: {
                            top: 16,
                            right: 10,
                        },
                    }}
                    Icon={() => {
                        return <AntDesign name="down" size={16} color="white" />;
                    }}
                />
            </StyledPickerContainer>
        </StyledView>
    );
};

export default PrioritySelector;
