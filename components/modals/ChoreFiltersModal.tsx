// src/components/modals/FiltersModal.tsx

import React, {useEffect, useMemo, useState} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback, StyleSheet, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
//import { styled } from 'nativewind';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {priorityOptions, Tag} from '@/types';
import dayjs from '@/utils/dayjsConfig';
import {AntDesign} from "@expo/vector-icons";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";
import {Colors} from "@/constants/Colors";
import CheckboxItem from "@/components/common/CheckboxItem";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: any;
    setFilters: (filters: any) => void;
    resetFilters: () => void;
    tags: Tag[];
    isTagsLoading: boolean;
}

const ChoreFiltersModal: React.FC<FiltersModalProps> = ({
                                                       visible,
                                                       onClose,
                                                       filters,
                                                       setFilters,
                                                       resetFilters,
                                                       tags,
                                                       isTagsLoading,
                                                   }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    // State for date pickers
    const [showLastCompletedStartDatePicker, setShowLastCompletedStartDatePicker] = useState(false);
    const [showLastCompletedEndDatePicker, setShowLastCompletedEndDatePicker] = useState(false);

    // State for timeLeft range inputs
    const [timeLeftMin, setTimeLeftMin] = useState(
        filters.timeLeftRange[0] !== null ? filters.timeLeftRange[0].toString() : ''
    );
    const [timeLeftMax, setTimeLeftMax] = useState(
        filters.timeLeftRange[1] !== null ? filters.timeLeftRange[1].toString() : ''
    );

    // Synchronize localFilters with filters prop when filters change or modal becomes visible
    useEffect(() => {
        if (visible) {
            setLocalFilters(filters);
            setTimeLeftMin(filters.timeLeftRange[0] !== null ? filters.timeLeftRange[0].toString() : '');
            setTimeLeftMax(filters.timeLeftRange[1] !== null ? filters.timeLeftRange[1].toString() : '');
        }
    }, [filters, visible]);

    const togglePriority = (priority: number) => {
        setLocalFilters({
            ...localFilters,
            priorities: {
                ...localFilters.priorities,
                [priority]: !localFilters.priorities[priority],
            },
        });
    };

    const toggleTag = (tagId: number) => {
        const newSelectedTags = { ...localFilters.selectedTags };
        if (newSelectedTags[tagId]) {
            delete newSelectedTags[tagId]; // Remove tag if it's already selected
        } else {
            newSelectedTags[tagId] = true; // Add tag if it's not selected
        }
        setLocalFilters({
            ...localFilters,
            selectedTags: newSelectedTags,
        });
    };

    const applyFilters = () => {
        // Parse timeLeftMin and timeLeftMax
        const parsedMin = timeLeftMin ? parseInt(timeLeftMin, 10) : null;
        const parsedMax = timeLeftMax ? parseInt(timeLeftMax, 10) : null;

        setFilters({
            ...localFilters,
            timeLeftRange: [parsedMin, parsedMax],
        });
        onClose();
    };

    const memoizedTagList = useMemo(() => {
        return tags?.map((tag) => (
            <CheckboxItem
                key={tag.id}
                itemId={tag.id}
                itemName={tag.name}
                isSelected={!!localFilters.selectedTags[tag.id]}
                onToggle={toggleTag}
            />
        ));
    }, [tags, localFilters.selectedTags, toggleTag]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <View className={`p-4 w-full max-w-md min-h-[300] max-h-[85%] rounded-t-3xl bg-medium`}>
                            <View className='flex-row'>
                                <AntDesign name="filter" size={20} color="white" />
                                <Text className={`ml-1 mb-2 text-lg font-bold text-accent`}>Filters</Text>
                            </View>

                            <View className='border-b-gray-500 border-b-2 mb-4'></View>

                            {/* Priority Filters */}
                            <View className='flex-row mt-2'>
                                <Text className={`mr-10 mb-2 font-semibold text-primary`}>Priority</Text>
                                {priorityOptions.map((option)=> (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => togglePriority(option.value)}
                                        className="flex-1 flex-row justify-center items-center mb-2"
                                    >
                                        <Checkbox
                                            value={localFilters.priorities[option.value]}
                                            onValueChange={() => togglePriority(option.value)}
                                        />
                                        <Text className="ml-2 font-bold" style={{color: option.color}}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>


                            {/* Overdue Status Filter */}
                            <View className='flex-row mt-2 items-center'>
                                <Text className={`flex-1 font-semibold text-primary`}>Overdue Status</Text>
                                <View className='flex-1'>
                                    <Picker
                                        selectedValue={localFilters.overdueStatus}
                                        onValueChange={(itemValue) =>
                                            setLocalFilters({ ...localFilters, overdueStatus: itemValue })
                                        }
                                        dropdownIconColor="white"
                                        mode={'dropdown'}
                                    >
                                        <Picker.Item label="Both" value="all" style={styles.pickerItem}/>
                                        <Picker.Item label="Overdue" value="overdue" style={styles.pickerItem}/>
                                        <Picker.Item label="Not Overdue" value="notOverdue" style={styles.pickerItem}/>
                                    </Picker>
                                </View>
                            </View>

                            <View className='flex-row gap-4'>
                                {/* Date Picker Section */}
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="p-3 rounded-lg mb-4"
                                        onPress={() => setShowLastCompletedStartDatePicker(true)}
                                        style={{backgroundColor: Colors.buttonSecondary}}
                                    >
                                        <Text className={`text-lg text-center font-bold text-primary`}>
                                            Start Date:{' '}
                                            {localFilters.lastCompletedStartDate
                                                ? dayjs(localFilters.lastCompletedStartDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </Text>
                                    </TouchableOpacity>

                                    {showLastCompletedStartDatePicker && (
                                        <DateTimePicker
                                            value={localFilters.lastCompletedStartDate || new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, date) => {
                                                setShowLastCompletedStartDatePicker(false);
                                                if (date && event.type !== 'dismissed') {
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        lastCompletedStartDate: date,
                                                    });
                                                }
                                            }}
                                            maximumDate={new Date()} // Optional: Prevent selecting future dates
                                        />
                                    )}
                                </View>

                                {/* Time Picker Section */}
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="p-3 rounded-lg mb-4"
                                        onPress={() => setShowLastCompletedEndDatePicker(true)}
                                        style={{backgroundColor: Colors.buttonSecondary}}
                                    >
                                        <Text className={`text-lg text-center font-bold text-primary`}>
                                            End Date:{' '}
                                            {localFilters.lastCompletedEndDate
                                                ? dayjs(localFilters.lastCompletedEndDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </Text>
                                    </TouchableOpacity>

                                    {showLastCompletedEndDatePicker && (
                                        <DateTimePicker
                                            value={localFilters.lastCompletedEndDate || new Date()}
                                            mode="time"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, date) => {
                                                setShowLastCompletedEndDatePicker(false);
                                                if (date && event.type !== 'dismissed') {
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        lastCompletedEndDate: date,
                                                    });
                                                }
                                            }}
                                            is24Hour={false} // Optional: Set to true for 24-hour format
                                        />
                                    )}
                                </View>
                            </View>

                            {/* Time Left Range */}
                            <Text className={`font-semibold mb-2 mt-4 text-primary`}>
                                Time Left Range (Days)
                            </Text>
                            <View className="flex-row items-center mb-2">
                                <TextInputFloatingLabel
                                    label="Min"
                                    value={timeLeftMin}
                                    onChangeText={setTimeLeftMin}
                                    keyboardType="numeric"
                                    style={{width: 80}}
                                />
                                <TextInputFloatingLabel
                                    label="Max"
                                    value={timeLeftMax}
                                    onChangeText={setTimeLeftMax}
                                    keyboardType="numeric"
                                    style={{width: 80}}
                                />
                            </View>

                            {/* Tags Filter */}
                            <Text className={`font-semibold mb-2 mt-4 text-primary`}>Tags</Text>
                            <View className="max-h-[30%] pb-2">
                                <ScrollView>
                                    {isTagsLoading ? (
                                        <ActivityIndicator size="large" color={Colors.accent} />
                                    ) : (
                                        memoizedTagList
                                    )}
                                </ScrollView>
                            </View>

                            {/* Buttons */}
                            <View className="flex-row gap-4 justify-between mt-4">
                                <TouchableOpacity
                                    className="flex-1 px-4 py-2 rounded-full items-center"
                                    onPress={resetFilters}
                                    accessibilityLabel="Cancel color change"
                                    style={{backgroundColor: Colors.buttonSecondary}}
                                >
                                    <Text className={`text-primary`}>Reset</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 px-4 py-2 rounded-full items-center`}
                                    onPress={applyFilters}
                                    accessibilityLabel="Save color change"
                                    style={{backgroundColor: Colors.buttonPrimary}}
                                >
                                    <Text className={`text-primary`}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
        fontSize: 18,
    },
});

export default ChoreFiltersModal;
