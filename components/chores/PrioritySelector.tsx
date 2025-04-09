import React from 'react';
import {View, Text} from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import { styled } from 'nativewind';
import { PriorityLevel, priorityOptions } from '@/types';
import {getPriorityLevelColor} from "@/utils/helpers";
import {Colors} from "@/constants/Colors";

// const View = styled(View);
// const Text = styled(Text);
// const Picker = styled(Picker);

const PrioritySelector = ({
                              priority,
                              setPriority,
                          }: {
    priority: PriorityLevel;
    setPriority: (value: PriorityLevel) => void;
}) => {
    const selectedTextColor = getPriorityLevelColor(priority);
    return (
        <View className="flex-row items-center justify-between py-1">
            {/* Label */}
            <Text className="min-w-[100] text-xl text-secondary">Priority</Text>
            <View className='flex-[35%]'></View>

            {/* Picker Container */}
            <View className="flex-[65%] pl-1">
                <Picker
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
                </Picker>
            </View>
        </View>
    );
};

export default PrioritySelector;
