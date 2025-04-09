// src/screens/EntriesScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity, StyleSheet} from 'react-native';
//import { styled } from 'nativewind';
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
import {SwipeListView} from "react-native-swipe-list-view";
import {getChoreNameById} from "@/utils/helpers";
import dayjs from "dayjs";
import EntryFiltersModal from "@/components/modals/EntryFiltersModal";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

const defaultEntryFilters = {
    completedStartDate: null as Date | null,
    completedEndDate: null as Date | null,
    selectedChores: {} as { [key: number]: boolean },
};

const EntriesScreen = () => {
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<'list' | 'chart'>('chart');
    const [selectedChoreId, setSelectedChoreId] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState('week');
    const [sortOption, setSortOption] = useState<string>('dateCompleted');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState(defaultEntryFilters);
    const [filtersModalVisible, setFiltersModalVisible] = useState<boolean>(false);

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



    const processedEntries = useMemo(() => {
        return entries.map((entry) : ProcessedEntry => ({
            ...entry,
            choreName: getChoreNameById(chores, entry.choreId) || '',
        }));
    }, [entries, chores, filters]);

    const filteredEntries = useMemo(() => {
        return processedEntries.filter((entry) => {
            const entryDate = dayjs(entry.dateCompleted);

            // Date range filter
            if (filters.completedStartDate && entryDate.isBefore(dayjs(filters.completedStartDate), 'day')) {
                return false;
            }
            if (filters.completedEndDate && entryDate.isAfter(dayjs(filters.completedEndDate), 'day')) {
                return false;
            }

            // Chore filter
            if (Object.keys(filters.selectedChores).length > 0) {
                const isChoreSelected = filters.selectedChores[entry.choreId];
                if (!isChoreSelected) return false;
            }

            return true;
        });
    }, [processedEntries, filters]);

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
    }, [processedEntries, sortOption, sortOrder]);

    const filteredChartEntries = useMemo(() => {
        return selectedChoreId ? processedEntries.filter(entry => entry.choreId === selectedChoreId) : [];
    }, [processedEntries, selectedChoreId]);

    if (isChoresLoading || isEntriesLoading) {
        return (
            <ThemedScreen headerTitle="Entries">
                <View className="p-2 flex-grow">
                    <ActivityIndicator size="large" color={Colors.accent} />
                </View>
            </ThemedScreen>
        );
    }

    return (
        <ThemedScreen headerTitle="Entries">
            <View className="flex-1">
                {/* Tab Navigation */}
                <View className="flex-row justify-around px-6">
                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'chart' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('chart')}
                    >
                        <FontAwesome name="area-chart" size={20} color={selectedTab === 'chart' ? Colors.accent : Colors.textPrimary} />
                        <Text className={`ml-2 text-lg font-semibold ${selectedTab === 'chart' ? 'text-accent' : 'text-primary'}`}>
                            Chart View
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'list' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('list')}
                    >
                        <FontAwesome name="list" size={20} color={selectedTab === 'list' ? Colors.accent : Colors.textPrimary} />
                        <Text className={`ml-2 text-lg font-semibold ${selectedTab === 'list' ? 'text-accent' : 'text-primary'}`}>
                            List View
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <View className="flex-1">
                    {selectedTab === 'list' ? (
                        <View className="p-4">
                            <View className="flex w-full py-2 px-4 mb-4 rounded-lg bg-medium">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-1 flex-row items-center">
                                        <TouchableOpacity
                                            onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        >
                                            <AntDesign name={sortOrder === 'asc' ? 'arrowup' : 'arrowdown'} size={20} color="white" />
                                        </TouchableOpacity>
                                        <Text className="ml-1 font-bold text-primary">Sort By</Text>
                                        <Picker
                                            selectedValue={sortOption}
                                            style={styles.picker}
                                            onValueChange={(itemValue) => setSortOption(itemValue)}
                                            dropdownIconColor={Colors.textPrimary}
                                            mode="dropdown"
                                        >
                                            <Picker.Item label="Name" value="choreName" style={styles.pickerItem} />
                                            <Picker.Item label="Date" value="dateCompleted" style={styles.pickerItem} />
                                        </Picker>
                                        <TouchableOpacity
                                            onPress={() => setFiltersModalVisible(true)}
                                            className="ml-4 px-4 py-2 items-end"
                                        >
                                            <View className="flex-row">
                                                <AntDesign name="filter" size={20} color="white" />
                                                <Text className="ml-1 text-primary">Filters</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

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
                                    <View className="flex-1 justify-center items-center">
                                        <Text className="text-secondary">No entries have been made.</Text>
                                    </View>
                                }
                            />
                        </View>
                    ) : (
                        <View className="p-2 flex-1">
                            <Container>
                                {/* Chore Picker */}
                                <View className="flex-row items-center">
                                    {/* Label */}
                                    <Text className="text-xl text-secondary">Chore</Text>
                                    <TouchableOpacity
                                        onPress={() => changeChore("decrease")}
                                        disabled={chores[0] && selectedChoreId === chores[0].id}
                                        className="my-4 p-2 rounded-lg ml-4"
                                        style={{ backgroundColor: selectedChoreId === chores[0].id ? Colors.buttonSecondary : Colors.buttonPrimary }}
                                    >
                                        <FontAwesome name="minus" size={20} color={Colors.textPrimary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        disabled={selectedChoreId === chores[chores.length - 1]?.id}
                                        onPress={() => changeChore("increase")}
                                        className="my-4 p-2 rounded-lg ml-2"
                                        style={{ backgroundColor: selectedChoreId === chores[chores.length - 1].id ? Colors.buttonSecondary : Colors.buttonPrimary }}
                                    >
                                        <FontAwesome name="plus" size={20} color={Colors.textPrimary} />
                                    </TouchableOpacity>
                                </View>

                                {/* Picker Container */}
                                <View className="flex-row items-center pl-1">
                                    <Picker
                                        selectedValue={selectedChoreId}
                                        onValueChange={(value) => setSelectedChoreId(value as number)}
                                        mode="dropdown"
                                        dropdownIconColor={Colors.textPrimary}
                                        style={styles.picker}
                                    >
                                        {chores.map(chore => (
                                            <Picker.Item
                                                key={chore.id}
                                                label={chore.name}
                                                value={chore.id}
                                                style={styles.pickerItem}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </Container>

                            <View className={`h-[400] w-full mb-4 rounded-lg bg-medium`}>
                                {/* Chart Component */}
                                <ChartComponent data={filteredChartEntries} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                            </View>
                        </View>
                    )}
                </View>

                {/* Add Entry Button */}
                <View className="absolute right-4 bottom-4">
                    <TouchableOpacity
                        onPress={handleAddEntryPressed}
                        style={{ backgroundColor: Colors.buttonAlternative }}
                        className="items-center justify-center w-14 h-14 rounded-full"
                    >
                        <AntDesign name="plus" size={30} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Add/Edit Entry Modal */}
                <AddEditEntryModal selectedEntry={selectedEntry} visible={isEntryModalVisible} onClose={handleCloseEntryModal} />

                {/* Options Modal */}
                <OptionsModal
                    visible={isOptionsModalVisible}
                    onClose={() => setIsOptionsModalVisible(false)}
                    option1Text="Delete"
                    option2Text="Cancel"
                    onOption1Press={handleDeleteEntry}
                    onOption2Press={() => setIsOptionsModalVisible(false)}
                />

                {/* Entry Filters Modal */}
                <EntryFiltersModal
                    visible={filtersModalVisible}
                    onClose={() => setFiltersModalVisible(false)}
                    filters={filters}
                    setFilters={setFilters}
                    resetFilters={() => setFilters(defaultEntryFilters)}
                    chores={chores}
                    isChoresLoading={isChoresLoading}
                />

            </View>
        </ThemedScreen>
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
    },
});

export default EntriesScreen;


