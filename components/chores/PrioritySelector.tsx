import React from 'react';
import {View, Text} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styled } from 'nativewind';
import { PriorityLevel, priorityOptions } from '@/types';
import {getPriorityLevelColor} from "@/utils/helpers";
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPicker = styled(Picker);

const PrioritySelector = ({
                              priority,
                              setPriority,
                          }: {
    priority: PriorityLevel;
    setPriority: (value: PriorityLevel) => void;
}) => {
    const selectedTextColor = getPriorityLevelColor(priority);
    return (
        <StyledView className="flex-row items-center justify-between py-1">
            {/* Label */}
            <StyledText className="min-w-[100] text-xl text-secondary">Priority</StyledText>
            <StyledView className='flex-[35%]'></StyledView>

            {/* Picker Container */}
            <StyledView className="flex-[65%] pl-1">
                <StyledPicker
                    className=""
                    selectedValue={priority}
                    onValueChange={(value) => setPriority(value as PriorityLevel)}
                    mode={'dropdown'}
                    dropdownIconColor="white"
                    style={{
                        color: selectedTextColor
                    }}
                >
                    {priorityOptions.map((option) => {
                        return (
                            <Picker.Item
                                key={option.value}
                                label={option.label}
                                value={option.value}
                                style={{
                                    backgroundColor: Colors.backgroundMedium,
                                    color: option.color,
                                    fontSize: 18,
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
