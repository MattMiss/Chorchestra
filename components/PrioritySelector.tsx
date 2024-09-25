import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { styled } from 'nativewind';
import { AntDesign } from '@expo/vector-icons';
import { FrequencyLevel, frequencyOptions } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPickerContainer = styled(View);

const FrequencySelector = ({
                               frequency,
                               setFrequency,
                           }: {
    frequency: FrequencyLevel;
    setFrequency: (value: FrequencyLevel) => void;
}) => {
    return (
        <StyledView className="flex-row items-center justify-between mt-4">
            {/* Label */}
            <StyledText className="text-white text-lg">Frequency</StyledText>

            {/* Picker Container */}
            <StyledPickerContainer className="bg-gray-800 rounded px-2">
                <RNPickerSelect
                    onValueChange={(value) => {
                        if (value !== null) {
                            setFrequency(value);
                        }
                    }}
                    items={frequencyOptions}
                    value={frequency}
                    placeholder={{}} // Empty object to avoid default placeholder
                    useNativeAndroidPickerStyle={false} // Allow custom styling on Android
                    style={{
                        inputAndroid: {
                            color: 'white',
                            fontSize: 16,
                            paddingVertical: 8,
                            paddingLeft: 10,
                            paddingRight: 30
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

export default FrequencySelector;
