import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
//import { styled } from 'nativewind';
import { Entry } from '@/types';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from "@/constants/Colors";
import { useChoresContext } from "@/context/ChoresContext";
import { useEntriesContext } from "@/context/EntriesContext";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);
// const Picker = styled(Picker);

interface EntryModalProps {
    selectedEntry?: Entry;
    choreId?: number;
    visible: boolean;
    onClose: () => void;
}

const AddEditEntryModal = ({ selectedEntry, choreId, visible, onClose }: EntryModalProps) => {
    const [entryChoreId, setEntryChoreId] = useState<number | null>(null);
    const [dateCompleted, setDateCompleted] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

    const { chores } = useChoresContext();
    const { addEntry, editEntry } = useEntriesContext();

    useEffect(() => {
        handleClearEntry();
        if (selectedEntry) {
            setEntryChoreId(selectedEntry.choreId);
            setDateCompleted(new Date(selectedEntry.dateCompleted));
        } else if (choreId) {
            setEntryChoreId(choreId);
        } else if (chores.length > 0) {
            setEntryChoreId(chores[0].id);
        }
    }, [visible, selectedEntry, choreId, chores]);

    const handleClearEntry = useCallback(() => {
        setEntryChoreId(null);
        setDateCompleted(new Date());
    }, []);

    const handleSaveEntry = () => {
        if (!entryChoreId || !dateCompleted) {
            console.log("No choreId or dateCompleted");
            return;
        }

        if (selectedEntry) {
            // Update an existing entry
            const updatedEntry: Entry = {
                ...selectedEntry,
                choreId: entryChoreId,
                dateCompleted: dateCompleted.toISOString(),
            };
            editEntry(updatedEntry); // Use editEntry from context
        } else {
            // Create and add a new entry
            const newEntry: Entry = {
                id: Date.now(),
                choreId: entryChoreId,
                dateCompleted: dateCompleted.toISOString(),
            };
            addEntry(newEntry); // Use addEntry from context
        }

        handleClearEntry();
        onClose();
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setDateCompleted(prevDate => {
                const newDate = new Date(prevDate);
                newDate.setFullYear(selectedDate.getFullYear());
                newDate.setMonth(selectedDate.getMonth());
                newDate.setDate(selectedDate.getDate());
                return newDate;
            });
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedTime) {
            setDateCompleted(prevDate => {
                const newDate = new Date(prevDate);
                newDate.setHours(selectedTime.getHours());
                newDate.setMinutes(selectedTime.getMinutes());
                newDate.setSeconds(0);
                newDate.setMilliseconds(0);
                return newDate;
            });
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end items-center bg-transparent-70">
                    <TouchableWithoutFeedback>
                        <View className="p-4 w-full max-w-md min-h-[300] rounded-t-3xl bg-medium">
                            {/* Chore Dropdown Row */}
                            <View className="flex-row items-center mb-4">
                                <Text className="mr-4 text-xl font-bold text-accent">Chore</Text>
                                <View className="flex-1">
                                    <Picker
                                        selectedValue={entryChoreId}
                                        onValueChange={(value) => setEntryChoreId(value as number)}
                                        mode={'dropdown'}
                                        dropdownIconColor="white"
                                        style={{ color: Colors.textPrimary }}
                                    >
                                        {chores.map((option) => (
                                            <Picker.Item
                                                key={option.id}
                                                label={option.name}
                                                value={option.id}
                                                style={{
                                                    backgroundColor: Colors.backgroundMedium,
                                                    color: Colors.textPrimary,
                                                    fontSize: 16,
                                                }}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View className="flex-row gap-4">
                                {/* Date Picker Section */}
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="p-3 rounded-lg mb-4"
                                        onPress={() => setShowDatePicker(true)}
                                        style={{ backgroundColor: Colors.buttonSecondary }}
                                    >
                                        <Text className="text-lg text-center font-bold text-primary">
                                            {`${dateCompleted.toLocaleDateString()}`}
                                        </Text>
                                    </TouchableOpacity>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={dateCompleted}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleDateChange}
                                            maximumDate={new Date()} // Prevent selecting future dates
                                        />
                                    )}
                                </View>

                                {/* Time Picker Section */}
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="p-3 rounded-lg mb-4"
                                        onPress={() => setShowTimePicker(true)}
                                        style={{ backgroundColor: Colors.buttonSecondary }}
                                    >
                                        <Text className="text-lg text-center font-bold text-primary">
                                            {`${dateCompleted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        </Text>
                                    </TouchableOpacity>

                                    {showTimePicker && (
                                        <DateTimePicker
                                            value={dateCompleted}
                                            mode="time"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleTimeChange}
                                            is24Hour={false} // Set to true for 24-hour format
                                        />
                                    )}
                                </View>
                            </View>

                            {/* Save Button */}
                            <View>
                                <TouchableOpacity
                                    onPress={handleSaveEntry}
                                    className="my-4 p-3 rounded-lg"
                                    style={{ backgroundColor: Colors.buttonPrimary }}
                                >
                                    <Text className="text-white text-center">
                                        {selectedEntry ? 'Save' : 'Add Entry'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default AddEditEntryModal;
