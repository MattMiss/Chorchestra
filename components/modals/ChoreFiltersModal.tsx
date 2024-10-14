// src/components/modals/FiltersModal.tsx

import React, {useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback, StyleSheet, Platform,
} from 'react-native';
import { styled } from 'nativewind';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {priorityOptions, Tag} from '@/types';
import dayjs from 'dayjs';
import {AntDesign} from "@expo/vector-icons";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: any;
    setFilters: (filters: any) => void;
    resetFilters: () => void;
    tags: Tag[];
}

const ChoreFiltersModal: React.FC<FiltersModalProps> = ({
                                                       visible,
                                                       onClose,
                                                       filters,
                                                       setFilters,
                                                       resetFilters,
                                                       tags,
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

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className={`p-4 w-full max-w-md min-h-[300] rounded-t-3xl bg-[${Colors.backgroundMedium}]`}>
                            <StyledView className='flex-row'>
                                <AntDesign name="filter" size={20} color="white" />
                                <StyledText className={`ml-1 mb-2 text-lg font-bold text-[${Colors.accent}]`}>Filters</StyledText>
                            </StyledView>

                            <StyledView className='border-b-gray-500 border-b-2 mb-4'></StyledView>

                            {/* Priority Filters */}
                            <StyledView className='flex-row mt-2'>
                                <StyledText className={`mr-10 mb-2 font-semibold text-[${Colors.textPrimary}]`}>Priority</StyledText>
                                {priorityOptions.map((option)=> (
                                    <StyledTouchableOpacity
                                        key={option.value}
                                        onPress={() => togglePriority(option.value)}
                                        className="flex-1 flex-row justify-center items-center mb-2"
                                    >
                                        <Checkbox
                                            value={localFilters.priorities[option.value]}
                                            onValueChange={() => togglePriority(option.value)}
                                        />
                                        <StyledText className="ml-2 font-bold" style={{color: option.color}}>{option.label}</StyledText>
                                    </StyledTouchableOpacity>
                                ))}
                            </StyledView>


                            {/* Overdue Status Filter */}
                            <StyledView className='flex-row mt-2 items-center'>
                                <StyledText className={`flex-1 font-semibold text-[${Colors.textPrimary}]`}>Overdue Status</StyledText>
                                <StyledView className='flex-1'>
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
                                </StyledView>
                            </StyledView>

                            <StyledView className='flex-row gap-4'>
                                {/* Date Picker Section */}
                                <StyledView className="flex-1">
                                    <StyledTouchableOpacity
                                        className="p-3 rounded-lg mb-4"
                                        onPress={() => setShowLastCompletedStartDatePicker(true)}
                                        style={{backgroundColor: Colors.buttonSecondary}}
                                    >
                                        <StyledText className={`text-lg text-center font-bold text-[${Colors.textPrimary}]`}>
                                            Start Date:{' '}
                                            {localFilters.lastCompletedStartDate
                                                ? dayjs(localFilters.lastCompletedStartDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </StyledText>
                                    </StyledTouchableOpacity>

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
                                </StyledView>

                                {/* Time Picker Section */}
                                <StyledView className="flex-1">
                                    <StyledTouchableOpacity
                                        className="p-3 rounded-lg mb-4"
                                        onPress={() => setShowLastCompletedEndDatePicker(true)}
                                        style={{backgroundColor: Colors.buttonSecondary}}
                                    >
                                        <StyledText className={`text-lg text-center font-bold text-[${Colors.textPrimary}]`}>
                                            End Date:{' '}
                                            {localFilters.lastCompletedEndDate
                                                ? dayjs(localFilters.lastCompletedEndDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </StyledText>
                                    </StyledTouchableOpacity>

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
                                </StyledView>
                            </StyledView>

                            {/* Time Left Range */}
                            <StyledText className={`font-semibold mb-2 mt-4 text-[${Colors.textPrimary}]`}>
                                Time Left Range (Days)
                            </StyledText>
                            <StyledView className="flex-row items-center mb-2">
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
                            </StyledView>

                            {/* Tags Filter */}
                            <StyledText className={`font-semibold mb-2 mt-4 text-[${Colors.textPrimary}]`}>Tags</StyledText>
                            {tags.map((tag) => (
                                <StyledTouchableOpacity
                                    key={tag.id}
                                    onPress={() => toggleTag(tag.id)}
                                    className="flex-row items-center mb-2"
                                >
                                    <Checkbox
                                        value={localFilters.selectedTags[tag.id] || false}
                                        onValueChange={() => toggleTag(tag.id)}
                                    />
                                    <StyledText className={`ml-2 text-[${Colors.textPrimary}]`}>{tag.name}</StyledText>
                                </StyledTouchableOpacity>
                            ))}

                            {/* Buttons */}
                            <StyledView className="flex-row gap-4 justify-between mt-4">
                                <StyledTouchableOpacity
                                    className="flex-1 px-4 py-2 rounded-full items-center"
                                    onPress={resetFilters}
                                    accessibilityLabel="Cancel color change"
                                    style={{backgroundColor: Colors.buttonSecondary}}
                                >
                                    <StyledText className={`text-[${Colors.textPrimary}]`}>Reset</StyledText>
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity
                                    className={`flex-1 px-4 py-2 rounded-full items-center`}
                                    onPress={applyFilters}
                                    accessibilityLabel="Save color change"
                                    style={{backgroundColor: Colors.buttonPrimary}}
                                >
                                    <StyledText className={`text-[${Colors.textPrimary}]`}>Apply</StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
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
