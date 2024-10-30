// src/screens/EntriesScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity, StyleSheet} from 'react-native';
import { styled } from 'nativewind';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import { useChoresContext } from '@/context/ChoresContext';
import { useEntriesContext } from '@/context/EntriesContext';
import ThemedScreen from '@/components/common/ThemedScreen';
import AddEditEntryModal from '@/components/modals/AddEditEntryModal';
import {EntryListItem, EntryListItemHidden} from '@/components/entries/EntryListItem';
import OptionsModal from '@/components/modals/OptionsModal';
import ChartComponent from '@/components/charts/ChartComponent';
import { Colors } from '@/constants/Colors';
import {Entry, ProcessedEntry} from '@/types';
import { Picker } from '@react-native-picker/picker';
import Container from "@/components/common/Container";
import {sortChoresByName} from "@/utils/chores";
import {SwipeListView} from "react-native-swipe-list-view";
import {getChoreNameById} from "@/utils/helpers";
import dayjs from "dayjs";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledPicker = styled(Picker);

const EntriesScreen = () => {
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<'list' | 'chart'>('chart');
    const [selectedChoreId, setSelectedChoreId] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState('week');
    const [sortOption, setSortOption] = useState<string>('dateCompleted');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { chores, isChoresLoading } = useChoresContext();
    const { entries, isEntriesLoading, deleteEntry } = useEntriesContext();

    const handleAddEntryPressed = () => {
        setSelectedEntry(undefined);
        setIsEntryModalVisible(true);
    };

    const handleEditEntryPressed = (item: Entry) => {
        setSelectedEntry(item);
        setIsEntryModalVisible(true);
    };

    const handleDeleteEntryPressed = (item: Entry) => {
        setSelectedEntry(item);
        setIsOptionsModalVisible(true);
    };

    const handleCloseEntryModal = () => {
        setSelectedEntry(undefined);
        setIsEntryModalVisible(false);
    };

    const handleDeleteEntry = () => {
        if (selectedEntry) {
            deleteEntry(selectedEntry.id);
            setSelectedEntry(undefined);
            setIsOptionsModalVisible(false);
        }
    };


    useEffect(() => {
        if (!isChoresLoading && chores.length > 0) {
            setSelectedChoreId(chores[0].id);
        }
    }, [isChoresLoading, chores]);

    const changeChore = (direction: "decrease" | "increase") => {
        if (!chores || chores.length === 0 || selectedChoreId === null) return;

        // Find the current chore index
        const currentIndex = chores.findIndex(chore => chore.id === selectedChoreId);

        if (currentIndex === -1) return; // Current chore not found

        if (direction === "decrease") {
            // Move to the previous chore if available
            const previousIndex = currentIndex > 0 ? currentIndex - 1 : chores.length - 1;
            setSelectedChoreId(chores[previousIndex].id);
        } else if (direction === "increase") {
            // Move to the next chore if available
            const nextIndex = currentIndex < chores.length - 1 ? currentIndex + 1 : 0;
            setSelectedChoreId(chores[nextIndex].id);
        }
    };



    const filteredEntries = useMemo(() => {
        return entries.map((entry) : ProcessedEntry => ({
            ...entry,
            choreName: getChoreNameById(chores, entry.choreId) || '',
        }));
    }, [entries, chores]);

    const sortedEntries = useMemo(() => {
        return [...filteredEntries].sort((a, b) => {
            let comparison = 0;
            switch (sortOption) {
                case 'choreName':
                    comparison = a.choreName.localeCompare(b.choreName);
                    break;
                case 'dateCompleted':
                    comparison = dayjs(a.dateCompleted).valueOf() - dayjs(b.dateCompleted).valueOf();
                    break;
                default:
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [filteredEntries, sortOption, sortOrder]);

    const filteredChartEntries = useMemo(() => {
        return selectedChoreId ? filteredEntries.filter(entry => entry.choreId === selectedChoreId) : [];
    }, [filteredEntries, selectedChoreId]);

    if (isChoresLoading || isEntriesLoading) {
        return (
            <ThemedScreen headerTitle="Entries">
                <StyledView className="p-2 flex-grow">
                    <ActivityIndicator size="large" color={Colors.accent} />
                </StyledView>
            </ThemedScreen>
        );
    }

    return (
        <ThemedScreen headerTitle="Entries">
            <StyledView className="flex-1">
                {/* Tab Navigation */}
                <StyledView className="flex-row justify-around px-6">
                    <StyledTouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'chart' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('chart')}
                    >
                        <FontAwesome name="area-chart" size={20} color={selectedTab === 'chart' ? Colors.accent : Colors.textPrimary} />
                        <StyledText className={`ml-2 text-lg font-semibold ${selectedTab === 'chart' ? 'text-accent' : 'text-primary'}`}>
                            Chart View
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'list' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('list')}
                    >
                        <FontAwesome name="list" size={20} color={selectedTab === 'list' ? Colors.accent : Colors.textPrimary} />
                        <StyledText className={`ml-2 text-lg font-semibold ${selectedTab === 'list' ? 'text-accent' : 'text-primary'}`}>
                            List View
                        </StyledText>
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Content Area */}
                <StyledView className="flex-1">
                    {selectedTab === 'list' ? (
                        <StyledView className="p-4">
                            <StyledView className="flex w-full py-2 px-4 mb-4 rounded-lg bg-medium">
                                <StyledView className="flex-row justify-between items-center">
                                    <StyledView className="flex-1 flex-row items-center">
                                        <StyledTouchableOpacity
                                            onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        >
                                            <AntDesign name={sortOrder === 'asc' ? 'arrowup' : 'arrowdown'} size={20} color="white" />
                                        </StyledTouchableOpacity>
                                        <StyledText className="ml-1 text-primary">Sort</StyledText>
                                        <StyledView className="flex-grow">
                                            <Picker
                                                selectedValue={sortOption}
                                                style={styles.picker}
                                                onValueChange={(itemValue) => setSortOption(itemValue)}
                                                dropdownIconColor="white"
                                                mode="dropdown"
                                            >
                                                <Picker.Item label="Chore Name" value="choreName" style={styles.pickerItem} />
                                                <Picker.Item label="Completed Date" value="dateCompleted" style={styles.pickerItem} />
                                            </Picker>
                                        </StyledView>
                                    </StyledView>
                                </StyledView>
                            </StyledView>

                            {/* Swipeable List for Tags */}
                            <SwipeListView
                                data={sortedEntries}
                                renderItem={({ item }) => (
                                    <EntryListItem
                                        entry={item}
                                    />
                                )}
                                renderHiddenItem={({ item }) => (
                                    <EntryListItemHidden
                                        onEditPress={() => handleEditEntryPressed(item)}
                                        onDeletePress={() => handleDeleteEntryPressed(item)}
                                    />
                                )}
                                rightOpenValue={-90}
                                disableRightSwipe
                                contentContainerStyle={{ paddingBottom: 100 }}
                                ListEmptyComponent={
                                    <StyledView className="flex-1 justify-center items-center">
                                        <StyledText className="text-secondary">No entries have been made.</StyledText>
                                    </StyledView>
                                }
                            />
                        </StyledView>
                    ) : (
                        <StyledView className="p-2 flex-1">
                            <Container>
                                {/* Chore Picker */}
                                <StyledView className="flex-row items-center">
                                    {/* Label */}
                                    <StyledText className="text-xl text-secondary">Chore</StyledText>
                                    <StyledTouchableOpacity
                                        onPress={() => changeChore("decrease")}
                                        disabled={chores[0] && selectedChoreId === chores[0].id}
                                        className="my-4 p-2 rounded-lg ml-4"
                                        style={{ backgroundColor: selectedChoreId === chores[0].id ? Colors.buttonSecondary : Colors.buttonPrimary }}
                                    >
                                        <FontAwesome name="minus" size={20} color={Colors.textPrimary} />
                                    </StyledTouchableOpacity>
                                    <StyledTouchableOpacity
                                        disabled={selectedChoreId === chores[chores.length - 1]?.id}
                                        onPress={() => changeChore("increase")}
                                        className="my-4 p-2 rounded-lg ml-2"
                                        style={{ backgroundColor: selectedChoreId === chores[chores.length - 1].id ? Colors.buttonSecondary : Colors.buttonPrimary }}
                                    >
                                        <FontAwesome name="plus" size={20} color={Colors.textPrimary} />
                                    </StyledTouchableOpacity>
                                </StyledView>

                                {/* Picker Container */}
                                <StyledView className="flex-row items-center pl-1">
                                    <StyledView className="flex-grow">
                                        <StyledPicker
                                            selectedValue={selectedChoreId}
                                            onValueChange={(value) => setSelectedChoreId(value as number)}
                                            mode="dropdown"
                                            style={styles.picker}
                                        >
                                            {sortChoresByName(chores).map(chore => (
                                                <Picker.Item
                                                    key={chore.id}
                                                    label={chore.name}
                                                    value={chore.id}
                                                    style={styles.pickerItem}
                                                />
                                            ))}
                                        </StyledPicker>
                                    </StyledView>
                                </StyledView>
                            </Container>

                            <StyledView className={`h-[400] w-full p-4 mb-4 rounded-lg bg-medium`}>
                                {/* Chart Component */}
                                <ChartComponent data={filteredChartEntries} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                            </StyledView>
                        </StyledView>
                    )}
                </StyledView>

                {/* Add Entry Button */}
                <StyledView className="absolute right-4 bottom-4">
                    <StyledTouchableOpacity
                        onPress={handleAddEntryPressed}
                        style={{ backgroundColor: Colors.buttonAlternative }}
                        className="items-center justify-center w-14 h-14 rounded-full"
                    >
                        <AntDesign name="plus" size={30} color="white" />
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Modals */}
                <AddEditEntryModal selectedEntry={selectedEntry} visible={isEntryModalVisible} onClose={handleCloseEntryModal} />
                <OptionsModal
                    visible={isOptionsModalVisible}
                    onClose={() => setIsOptionsModalVisible(false)}
                    option1Text="Delete"
                    option2Text="Cancel"
                    onOption1Press={handleDeleteEntry}
                    onOption2Press={() => setIsOptionsModalVisible(false)}
                />
            </StyledView>
        </ThemedScreen>
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

export default EntriesScreen;


