// src/screens/ChoresScreen.tsx

import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {styled} from 'nativewind';
import {router} from 'expo-router';
import {ProcessedChore, Section, Tag} from '@/types';
import {useDataContext} from '@/context/DataContext';
import ThemedScreen from '@/components/common/ThemedScreen';
import {AntDesign} from '@expo/vector-icons';
import ChoreCard from '@/components/chores/ChoreCard';
import {getLastCompletionDate, getNextDueDate, getTagById, getTimeLeft, groupChores} from '@/utils/helpers';
import AddEditEntryModal from "@/components/modals/AddEditEntryModal";
import dayjs from "dayjs";
import {Picker} from "@react-native-picker/picker";
import ChoreFiltersModal from "@/components/modals/ChoreFiltersModal";
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const defaultFilters = {
    priorities: { 1: true, 2: true, 3: true }, // 1: Low, 2: Medium, 3: High
    overdueStatus: 'all', // 'overdue', 'notOverdue', 'all'
    lastCompletedStartDate: null as Date | null,
    lastCompletedEndDate: null as Date | null,
    timeLeftRange: [null, null] as [number | null, number | null],
    selectedTags: {} as { [key: number]: boolean },
};

const ChoresScreen = () => {
    const { chores, tags, entries, isLoading } = useDataContext();

    const [selectedChore, setSelectedChore] = useState<ProcessedChore | null>(null);
    const [addEditEntryModalVisible, setAddEditEntryModalVisible] = useState<boolean>(false);

    // New state variables
    const [filtersModalVisible, setFiltersModalVisible] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>('choreName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => {
        // Optional: Log chores for debugging
        // console.log("Chores: ", JSON.stringify(chores, null, 2));
    }, [chores]);

    // Processed Chores
    const processedChores: ProcessedChore[] = useMemo(() => {
        return chores.map((chore) => {
            const lastCompletionDate = getLastCompletionDate(chore.id, entries);
            const nextDueDate = getNextDueDate(
                lastCompletionDate,
                chore.frequency,
                chore.frequencyType as 'day' | 'week' | 'month' | 'year'
            );
            const timeLeft = getTimeLeft(nextDueDate);
            const lastCompletedDisplay = lastCompletionDate
                ? lastCompletionDate.format('MMM D, YYYY')
                : 'Never';
            const isOverdue = nextDueDate.isBefore(dayjs(), 'day');

            return {
                ...chore,
                lastCompletedDisplay,
                nextDueDate,
                timeLeft,
                isOverdue,
            };
        });
    }, [chores, entries]);

    // Filtering Chores
    const filteredChores = useMemo(() => {
        return processedChores.filter((chore) => {
            // Filter by priority
            if (!filters.priorities[chore.priority]) return false;

            // Filter by overdue status
            if (filters.overdueStatus === 'overdue' && !chore.isOverdue) return false;
            if (filters.overdueStatus === 'notOverdue' && chore.isOverdue) return false;

            // Filter by last completed date range
            if (filters.lastCompletedStartDate || filters.lastCompletedEndDate) {
                const lastCompletedDate = getLastCompletionDate(chore.id, entries);
                if (lastCompletedDate) {
                    if (
                        filters.lastCompletedStartDate &&
                        lastCompletedDate.isBefore(dayjs(filters.lastCompletedStartDate), 'day')
                    )
                        return false;
                    if (
                        filters.lastCompletedEndDate &&
                        lastCompletedDate.isAfter(dayjs(filters.lastCompletedEndDate), 'day')
                    )
                        return false;
                } else {
                    // Exclude chores never completed if date range is set
                    return false;
                }
            }

            // Filter by time left range
            if (filters.timeLeftRange[0] !== null || filters.timeLeftRange[1] !== null) {
                const daysLeft = chore.nextDueDate.diff(dayjs(), 'day');
                if (filters.timeLeftRange[0] !== null && daysLeft < filters.timeLeftRange[0])
                    return false;
                if (filters.timeLeftRange[1] !== null && daysLeft > filters.timeLeftRange[1])
                    return false;
            }

            // Filter by tags
            const anyTagSelected = Object.values(filters.selectedTags).some((selected) => selected);
            if (anyTagSelected) {
                const hasSelectedTag = chore.tagIds.some((tagId) => filters.selectedTags[tagId]);
                if (!hasSelectedTag) return false;
            }

            return true;
        });
    }, [processedChores, filters, entries]);



    // Sorting Chores
    const sortedChores = useMemo(() => {
        return [...filteredChores].sort((a, b) => {
            let comparison = 0;

            // Primary Comparison based on sortOption
            switch (sortOption) {
                case 'choreName':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'estTime':
                    comparison = a.estTime - b.estTime;
                    break;
                case 'frequency':
                    comparison = a.frequency - b.frequency;
                    break;
                case 'lastCompleted':
                    const aLastCompleted = getLastCompletionDate(a.id, entries);
                    const bLastCompleted = getLastCompletionDate(b.id, entries);
                    comparison =
                        (aLastCompleted ? aLastCompleted.valueOf() : 0) -
                        (bLastCompleted ? bLastCompleted.valueOf() : 0);
                    break;
                case 'timeLeft':
                    if (a.timeLeft === b.timeLeft) {
                        comparison = 0;
                    } else {
                        comparison = a.nextDueDate.valueOf() - b.nextDueDate.valueOf();
                    }
                    break;
                case 'isOverdue':
                    comparison = Number(a.isOverdue) - Number(b.isOverdue);
                    break;
                case 'priority':
                    comparison = a.priority - b.priority;
                    break;
                default:
                    break;
            }

            // Secondary Comparison by Name if Primary is Equal
            if (comparison === 0 && sortOption !== 'choreName') {
                comparison = a.name.localeCompare(b.name);
            }

            // Adjust comparison based on sortOrder
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [filteredChores, sortOption, sortOrder, entries]);


    // Grouping Chores into Sections Based on `groupBy`
    const sectionedChores: Section[] = useMemo(() => {
        return groupChores(sortedChores, sortOption);
    }, [sortedChores, sortOption]);


    const renderChore = ({ item }: { item: ProcessedChore }) => {
        // Get the full Tag objects from the tag IDs
        const tagsForChore = item.tagIds.map((tagId) => getTagById(tags, tagId)).filter(Boolean) as Tag[];


        return (
            <StyledView className="px-2">
                <ChoreCard
                    chore={item}
                    tags={tagsForChore}
                    onCompletedPress={() => {
                        setSelectedChore(item);
                        setAddEditEntryModalVisible(true);
                    }}
                    onEditPress={() => handleEditChore(item.id)}
                    lastCompleted={item.lastCompletedDisplay}
                    timeLeft={item.timeLeft}
                />
            </StyledView>
        );
    };

    // Function to handle editing a chore
    const handleEditChore = (choreId: number) => {
        // Navigate to the AddEditChoreScreen and pass the choreId as a parameter
        router.push({
            pathname: '/chores/add-edit-chore',
            params: { choreId: choreId.toString() },
        });
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
    }

    // If loading, show a spinner
    if (isLoading) {
        return (
            <ThemedScreen
                showHeaderNavButton={false}
                showHeaderNavOptionButton={true}
                headerTitle={"Chores"}
            >
                <StyledView className="p-2 flex-grow">
                    <ActivityIndicator size="large" color={Colors.accent} />
                </StyledView>
            </ThemedScreen>
        );
    }

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={true}
            headerTitle={"Chores"}
        >
            <StyledView className="px-2 flex-1">
                <StyledView className={`flex w-full py-2 px-4 mb-4 rounded-lg bg-medium`}>
                    {/* Filters and Sort By Section */}
                    <StyledView className="flex-row justify-between items-center">

                        {/* Sort By Dropdown */}
                        <StyledView className="flex-1 flex-row items-center">
                            <StyledTouchableOpacity
                                onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className=""
                            >
                                <AntDesign
                                    name={sortOrder === 'asc' ? 'arrowup' : 'arrowdown'}
                                    size={20}
                                    color="white"
                                />
                            </StyledTouchableOpacity>
                            <StyledText className={`ml-1 text-primary`}>Sort</StyledText>
                            <Picker
                                selectedValue={sortOption}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSortOption(itemValue)}
                                dropdownIconColor="white"
                                mode={'dropdown'}
                            >
                                <Picker.Item label="Chore Name" value="choreName" style={styles.pickerItem} />
                                <Picker.Item label="Due Next" value="timeLeft" style={styles.pickerItem}/>
                                <Picker.Item label="Est Time" value="estTime" style={styles.pickerItem}/>
                                <Picker.Item label="Frequency" value="frequency" style={styles.pickerItem}/>
                                <Picker.Item label="Last Completed" value="lastCompleted" style={styles.pickerItem}/>
                                <Picker.Item label="Is Overdue" value="isOverdue" style={styles.pickerItem}/>
                                <Picker.Item label="Priority" value="priority" style={styles.pickerItem}/>
                            </Picker>
                        </StyledView>
                        {/* Filters Button */}
                        <StyledTouchableOpacity
                            onPress={() => setFiltersModalVisible(true)}
                            className="ml-4 px-4 py-2 items-end"
                        >
                            <StyledView className='flex-row'>
                                <AntDesign name="filter" size={20} color="white" />
                                <StyledText className={`ml-1 text-primary`}>Filters</StyledText>
                            </StyledView>

                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>


                {/* Chores SectionList */}
                {sectionedChores.length > 0 ? (
                    <SectionList
                        sections={sectionedChores}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderChore}
                        renderSectionHeader={({ section: { title } }) => (
                            <StyledView className="flex-row items-center mt-2 mb-6">
                                <StyledView className="flex-grow bg-sectionTitle h-1 mr-2 mt-1"></StyledView>
                                <StyledText className="font-bold text-lg text-primary text-center">{title}</StyledText>
                                <StyledView className="flex-grow bg-sectionTitle h-1 ml-2 mt-1"></StyledView>
                            </StyledView>
                        )}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                ) : (
                    <StyledView className="flex-1 justify-center items-center">
                        <StyledText className={`text-lg text-secondary`}>No chores found</StyledText>
                    </StyledView>
                )}
            </StyledView>
            <StyledView className='absolute right-4 bottom-4'>
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 rounded-full"
                    onPress={() => router.push('/chores/add-edit-chore')}
                    accessibilityLabel="Add new chore"
                    style={{backgroundColor: Colors.buttonAlternative}}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </StyledTouchableOpacity>
            </StyledView>

            {/* Filters Modal */}
            <ChoreFiltersModal
                visible={filtersModalVisible}
                onClose={() => setFiltersModalVisible(false)}
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                tags={tags}
            />

            {/* AddEditEntryModal */}
            <AddEditEntryModal
                visible={addEditEntryModalVisible}
                choreId={selectedChore ? selectedChore.id : undefined}
                onClose={() => setAddEditEntryModalVisible(false)}
            />
        </ThemedScreen>
    );
};

const styles = StyleSheet.create({
    picker: {
        color: Colors.textPrimary,
        flex: 1
    },
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
    },
});

export default ChoresScreen;
