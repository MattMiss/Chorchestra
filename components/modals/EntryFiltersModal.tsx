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
import { styled } from 'nativewind';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chore } from '@/types';
import dayjs from '@/utils/dayjsConfig';
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ChoreCheckboxItem from "@/components/chores/ChoreCheckboxItem";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface EntryFiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: any;
    setFilters: (filters: any) => void;
    resetFilters: () => void;
    chores: Chore[] | null;  // Update to handle possibly null chores data
    isChoresLoading: boolean; // New prop to handle loading state
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
            <ChoreCheckboxItem
                key={chore.id}
                choreId={chore.id}
                choreName={chore.name}
                isSelected={!!localFilters.selectedChores[chore.id]}
                onToggle={toggleChore}
            />
        ));
    }, [chores, localFilters.selectedChores, toggleChore]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <StyledView className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <StyledView className={`p-4 w-full max-w-md min-h-[300] max-h-[80%] rounded-t-3xl bg-medium`}>
                            <StyledView className='flex-row'>
                                <AntDesign name="filter" size={20} color="white" />
                                <StyledText className={`ml-1 mb-2 text-lg font-bold text-accent`}>Filters</StyledText>
                            </StyledView>

                            <StyledView className='border-b-gray-500 border-b-2 mb-4'></StyledView>

                            {/* Date Range Filter */}
                            <StyledView className='flex-row gap-4'>
                                {/* Start Date Picker Section */}
                                <StyledView className="flex-1">
                                    <StyledTouchableOpacity
                                        className="p-2 rounded-lg mb-2"
                                        onPress={() => setShowStartDatePicker(true)}
                                        style={{ backgroundColor: Colors.buttonSecondary }}
                                    >
                                        <StyledText className={`text-center font-bold text-primary`}>
                                            Begin:{' '}
                                            {localFilters.completedStartDate
                                                ? dayjs(localFilters.completedStartDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </StyledText>
                                    </StyledTouchableOpacity>

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
                                </StyledView>

                                {/* End Date Picker Section */}
                                <StyledView className="flex-1">
                                    <StyledTouchableOpacity
                                        className="p-2 rounded-lg mb-2"
                                        onPress={() => setShowEndDatePicker(true)}
                                        style={{ backgroundColor: Colors.buttonSecondary }}
                                    >
                                        <StyledText className={`text-center font-bold text-primary`}>
                                            End:{' '}
                                            {localFilters.completedEndDate
                                                ? dayjs(localFilters.completedEndDate).format('MMM D, YYYY')
                                                : 'Any'}
                                        </StyledText>
                                    </StyledTouchableOpacity>

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
                                </StyledView>
                            </StyledView>

                            {/* Chores Filter */}
                            <StyledText className={`font-semibold mb-2 mt-4 text-primary`}>Chores</StyledText>
                            <StyledView className="max-h-[60%] pb-2">
                                <ScrollView>
                                    {isChoresLoading ? (
                                        <ActivityIndicator size="large" color={Colors.accent} />
                                    ) : (
                                        memoizedChoreList
                                    )}
                                </ScrollView>
                            </StyledView>

                            {/* Buttons */}
                            <StyledView className="flex-row gap-4 justify-between mt-4">
                                <StyledTouchableOpacity
                                    className="flex-1 px-4 py-2 rounded-full items-center"
                                    onPress={resetFilters}
                                    accessibilityLabel="Cancel filter change"
                                    style={{ backgroundColor: Colors.buttonSecondary }}
                                >
                                    <StyledText className={`text-primary`}>Reset</StyledText>
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity
                                    className={`flex-1 px-4 py-2 rounded-full items-center`}
                                    onPress={applyFilters}
                                    accessibilityLabel="Apply filter change"
                                    style={{ backgroundColor: Colors.buttonPrimary }}
                                >
                                    <StyledText className={`text-primary`}>Apply</StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EntryFiltersModal;
