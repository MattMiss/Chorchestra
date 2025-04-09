// src/components/modals/EntryFiltersModal.tsx

import React, {useEffect, useMemo, useState} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform, ScrollView, ActivityIndicator
} from 'react-native';
//import { styled } from 'nativewind';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chore } from '@/types';
import dayjs from '@/utils/dayjsConfig';
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CheckboxItem from "@/components/common/CheckboxItem";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

interface EntryFiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: any;
    setFilters: (filters: any) => void;
    resetFilters: () => void;
    chores: Chore[] | null;
    isChoresLoading: boolean;
}

const EntryFiltersModal: React.FC<EntryFiltersModalProps> = ({
                                                                 visible,
                                                                 onClose,
                                                                 filters,
                                                                 setFilters,
                                                                 resetFilters,
                                                                 chores,
                                                                 isChoresLoading,
                                                             }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    // State for date pickers
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Synchronize localFilters with filters prop when filters change or modal becomes visible
    useEffect(() => {
        if (visible) {
            setLocalFilters(filters);
        }
    }, [filters, visible]);

    const toggleChore = (choreId: number) => {
        const newSelectedChores = { ...localFilters.selectedChores };
        if (newSelectedChores[choreId]) {
            delete newSelectedChores[choreId]; // Remove chore if it's already selected
        } else {
            newSelectedChores[choreId] = true; // Add chore if it's not selected
        }
        setLocalFilters({
            ...localFilters,
            selectedChores: newSelectedChores,
        });
    };

    const applyFilters = () => {
        setFilters(localFilters); // Ensure this triggers an update in EntriesScreen
        onClose();
    };

    const memoizedChoreList = useMemo(() => {
        return chores?.map((chore) => (
            <CheckboxItem
                key={chore.id}
                itemId={chore.id}
                itemName={chore.name}
                isSelected={!!localFilters.selectedChores[chore.id]}
                onToggle={toggleChore}
            />
        ));
    }, [chores, localFilters.selectedChores, toggleChore]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <View className={`p-4 w-full max-w-md min-h-[300] max-h-[80%] rounded-t-3xl bg-medium`}>
                            <View className='flex-row'>
                                <AntDesign name="filter" size={20} color="white" />
                                <Text className={`ml-1 mb-2 text-lg font-bold text-accent`}>Filters</Text>
                            </View>

                            <View className='border-b-gray-500 border-b-2 mb-4'></View>

                            {/* Date Range Filter */}
                            <View className='flex-row gap-4'>
                                {/* Start Date Picker Section */}
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="p-2 rounded-lg mb-2"
                                        onPress={() => setShowStartDatePicker(true)}
                                        style={{ backgroundColor: Colors.buttonSecondary }}
                                    >
                                        <Text className={`text-center font-bold text-primary`}>
                                            Begin:{' '}
                                            {localFilters.completedStartDate
                                                ? dayjs(localFilters.completedStartDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </Text>
                                    </TouchableOpacity>

                                    {showStartDatePicker && (
                                        <DateTimePicker
                                            value={localFilters.completedStartDate || new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, date) => {
                                                setShowStartDatePicker(false);
                                                if (date && event.type !== 'dismissed') {
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        completedStartDate: date,
                                                    });
                                                }
                                            }}
                                            maximumDate={new Date()} // Prevent selecting future dates
                                        />
                                    )}
                                </View>

                                {/* End Date Picker Section */}
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="p-2 rounded-lg mb-2"
                                        onPress={() => setShowEndDatePicker(true)}
                                        style={{ backgroundColor: Colors.buttonSecondary }}
                                    >
                                        <Text className={`text-center font-bold text-primary`}>
                                            End:{' '}
                                            {localFilters.completedEndDate
                                                ? dayjs(localFilters.completedEndDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </Text>
                                    </TouchableOpacity>

                                    {showEndDatePicker && (
                                        <DateTimePicker
                                            value={localFilters.completedEndDate || new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, date) => {
                                                setShowEndDatePicker(false);
                                                if (date && event.type !== 'dismissed') {
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        completedEndDate: date,
                                                    });
                                                }
                                            }}
                                            maximumDate={new Date()} // Prevent selecting future dates
                                        />
                                    )}
                                </View>
                            </View>

                            {/* Chores Filter */}
                            <Text className={`font-semibold mb-2 mt-4 text-primary`}>Chores</Text>
                            <View className="max-h-[60%] pb-2">
                                <ScrollView>
                                    {isChoresLoading ? (
                                        <ActivityIndicator size="large" color={Colors.accent} />
                                    ) : (
                                        memoizedChoreList
                                    )}
                                </ScrollView>
                            </View>

                            {/* Buttons */}
                            <View className="flex-row gap-4 justify-between mt-4">
                                <TouchableOpacity
                                    className="flex-1 px-4 py-2 rounded-full items-center"
                                    onPress={resetFilters}
                                    accessibilityLabel="Cancel filter change"
                                    style={{ backgroundColor: Colors.buttonSecondary }}
                                >
                                    <Text className={`text-primary`}>Reset</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 px-4 py-2 rounded-full items-center`}
                                    onPress={applyFilters}
                                    accessibilityLabel="Apply filter change"
                                    style={{ backgroundColor: Colors.buttonPrimary }}
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

export default EntryFiltersModal;
