// FrequencySelector.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styled } from 'nativewind';
import { FrequencyType, frequencyOptions } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPicker = styled(Picker);
const StyledInput = styled(TextInput);

interface FrequencySelectorProps {
    frequencyNumber: number;
    setFrequencyNumber: (value: number) => void;
    frequencyType: FrequencyType;
    setFrequencyType: (value: FrequencyType) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
                                                                 frequencyNumber,
                                                                 setFrequencyNumber,
                                                                 frequencyType,
                                                                 setFrequencyType,
                                                             }) => {
    return (
        <StyledView className="flex-row items-center justify-between py-1">
            {/* Label */}
            <StyledText className=" text-xl text-gray-400">Frequency</StyledText>
            <StyledView className="flex-1 flex-row items-center ml-5">
                {/* Number Input */}
                <StyledView className="flex-[35%] items-center">
                    <StyledInput
                        className={`pt-1  px-2 border-b border-gray-600 text-3xl text-white`}
                        keyboardType="number-pad"
                        value={frequencyNumber.toString()}
                        onChangeText={(text) => {
                            const num = parseInt(text, 10);
                            if (isNaN(num)) {
                                setFrequencyNumber(0);
                            }else if (num < 0) {
                                setFrequencyNumber(1);
                            }
                            else {
                                setFrequencyNumber(num);
                            }
                        }}
                        placeholder="1"
                        maxLength={3} // Limit to 3 digits (1-999)
                    />
                    {/*<Text style={styles.frequencyLabel}>*/}
                    {/*    {frequencyNumber > 1 ? `${frequencyType}s` : frequencyType}*/}
                    {/*</Text>*/}
                </StyledView>

                {/* Picker Container */}
                <StyledView className="flex-[65%] bg-blue-300">
                    <StyledPicker
                        selectedValue={frequencyType}
                        onValueChange={(value) => setFrequencyType(value as FrequencyType)}
                        mode={'dropdown'}
                        dropdownIconColor="white"
                        style={styles.picker}
                    >
                        {frequencyOptions.map((option) => {
                            const label = option.charAt(0).toUpperCase() + option.slice(1);
                            return (
                                <Picker.Item
                                    key={option}
                                    label={frequencyNumber > 1 ? `${label}s` : label}
                                    value={option}
                                    style={styles.pickerItem}
                                />
                            )
                        })}
                    </StyledPicker>
                </StyledView>
            </StyledView>


        </StyledView>
    );
};

const styles = StyleSheet.create({
    numberInput: {
        height: 40,
        borderColor: '#374151',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
        backgroundColor: '#374151',
        width: 60,
        textAlign: 'center',
        fontSize: 20,
    },
    frequencyLabel: {
        marginLeft: 10,
        fontSize: 18,
        color: '#fff',
        textAlign: 'left',
    },
    picker: {
        height: 40,
        color: '#fff',
        backgroundColor: '#030712',
        borderRadius: 8,
    },
    pickerItem: {
        backgroundColor: '#030712',
        color: '#fff',
        fontSize: 18,
    },
});

export default FrequencySelector;
