// FrequencySelector.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styled } from 'nativewind';
import { EstTimeType, estTimeTypeOptions } from '@/types';
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPicker = styled(Picker);
const StyledInput = styled(TextInput);

interface EstTimeSelectorProps {
    estTime: number;
    setEstTime: (value: number) => void;
    timeType: EstTimeType;
    setTimeType: (value: EstTimeType) => void;
}

const EstTimeSelector: React.FC<EstTimeSelectorProps> = ({
                                                             estTime,
                                                             setEstTime,
                                                             timeType,
                                                             setTimeType,
                                                             }) => {
    return (
        <StyledView className="flex-row items-center justify-between py-1">
            {/* Label */}
            <StyledText className={`min-w-[100] text-xl text-[${Colors.textSecondary}]`}>Est Time</StyledText>
            <StyledView className="flex-1 flex-row items-center ml-2">
                {/* Number Input */}
                <StyledView className="flex-[35%] items-center">
                    <StyledInput
                        className={`pt-1 px-2 border-b border-gray-600 text-3xl text-[${Colors.textPrimary}]`}
                        keyboardType="number-pad"
                        value={estTime?.toString()}
                        onChangeText={(text) => {
                            const num = parseInt(text, 10);
                            if (isNaN(num)) {
                                setEstTime(0);
                            }else if (num < 0) {
                                setEstTime(1);
                            }
                            else {
                                setEstTime(num);
                            }
                        }}
                        placeholder="1"
                        maxLength={3} // Limit to 3 digits (1-999)
                    />
                </StyledView>

                {/* Picker Container */}
                <StyledView className="flex-[65%]">
                    <StyledPicker
                        selectedValue={timeType}
                        onValueChange={(value) => setTimeType(value as EstTimeType)}
                        mode={'dropdown'}
                        dropdownIconColor="white"
                        style={styles.picker}
                    >
                        {estTimeTypeOptions.map((option) => {
                            const label = option.charAt(0).toUpperCase() + option.slice(1);
                            return (
                                <Picker.Item
                                    key={option}
                                    label={estTime > 1 ? `${label}s` : label}
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
    picker: {
        height: 40,
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
    },
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
        fontSize: 18,
    },
});

export default EstTimeSelector;
