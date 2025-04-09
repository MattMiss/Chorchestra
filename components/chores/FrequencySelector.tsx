// FrequencySelector.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import { styled } from 'nativewind';
import { FrequencyType, frequencyOptions } from '@/types';
import {Colors} from "@/constants/Colors";

// const View = styled(View);
// const Text = styled(Text);
// const Picker = styled(Picker);
// const StyledInput = styled(TextInput);

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
        <View className="flex-row items-center justify-between py-1">
            {/* Label */}
            <Text className={`min-w-[100] text-xl text-secondary`}>Frequency</Text>
            <View className="flex-1 flex-row items-center ml-2">
                {/* Number Input */}
                <View className="flex-[35%] items-center">
                    <TextInput
                        className={`pt-1 px-2 border-b border-gray-600 text-3xl text-primary`}
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
                </View>

                {/* Picker Container */}
                <View className="flex-[65%]">
                    <Picker
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
                    </Picker>
                </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        flex: 1,
        color: Colors.textPrimary,
    },
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
        fontSize: 18,
    },
});

export default FrequencySelector;
