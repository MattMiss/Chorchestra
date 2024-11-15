import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import { ProcessedChore, Section, Tag } from '@/types';
import ThemedScreen from '@/components/common/ThemedScreen';
import { AntDesign } from '@expo/vector-icons';
import ChoreCard from '@/components/chores/ChoreCard';
import { getTagById } from '@/utils/helpers';
import { getLastCompletionDate, getNextDueDate, getTimeLeft, groupChores } from '@/utils/chores';
import AddEditEntryModal from "@/components/modals/AddEditEntryModal";
import dayjs from '@/utils/dayjsConfig';
import { Picker } from "@react-native-picker/picker";
import ChoreFiltersModal from "@/components/modals/ChoreFiltersModal";
import { Colors } from "@/constants/Colors";
import { useChoresContext } from "@/context/ChoresContext";
import { useEntriesContext } from "@/context/EntriesContext";
import { useTagsContext } from "@/context/TagsContext";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const defaultChoreFilters = {
    priorities: { 1: true, 2: true, 3: true },
    overdueStatus: 'all',
    lastCompletedStartDate: null as Date | null,
    lastCompletedEndDate: null as Date | null,
    timeLeftRange: [null, null] as [number | null, number | null],
    selectedTags: {} as { [key: number]: boolean },
};

const ChoresScreen = () => {
    const { chores, isChoresLoading } = useChoresContext();
    const { entries } = useEntriesContext();
    const { tags, isTagsLoading } = useTagsContext();

    const [selectedChore, setSelectedChore] = useState<ProcessedChore | null>(null);
    const [addEditEntryModalVisible, setAddEditEntryModalVisible] = useState<boolean>(false);
    const [filtersModalVisible, setFiltersModalVisible] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>('timeLeft');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState(defaultChoreFilters);
    const [searchTerm, setSearchTerm] = useState('');

    const today = dayjs().startOf('day');

    useEffect(() => {
        console.log("Chores loaded:", chores);
    }, [chores]);

    const processedChores: ProcessedChore[] = useMemo(() => {
        return chores.map((chore) => {
            const lastCompletionDate = getLastCompletionDate(chore.id, entries);
            const nextDueDate = getNextDueDate(
                lastCompletionDate,
                chore.frequency,
                chore.frequencyType as 'day' | 'week' | 'month' | 'year'
            );
            const dueDate = dayjs(nextDueDate).startOf('day');
            const timeLeft = getTimeLeft(nextDueDate);
            const lastCompletedDisplay = lastCompletionDate
                ? lastCompletionDate.format('MMM D, YYYY')
                : 'Never';
            const isOverdue = dueDate.isBefore(today, 'day');

            return {
                ...chore,
                lastCompletedDisplay,
                nextDueDate,
                timeLeft,
                isOverdue,
            };
        });
    }, [chores, entries, today]);

    const filteredChores = useMemo(() => {
        return processedChores.filter((chore) => {
            // 1. Filter by priority
            if (!filters.priorities[chore.priority]) return false;

            // 2. Filter by overdue status
            if (filters.overdueStatus === 'overdue' && !chore.isOverdue) return false;
            if (filters.overdueStatus === 'notOverdue' && chore.isOverdue) return false;

            // 3. Filter by selected tags
            if (Object.keys(filters.selectedTags).length > 0) {
                // Check if chore's tags include at least one selected tag
                const hasSelectedTag = chore.tagIds.some(tagId => filters.selectedTags[tagId]);
                if (!hasSelectedTag) return false;
            }

            // 4. Filter by search term (ignore case)
            if (searchTerm !== '') {
                const searchTermLower = searchTerm.toLowerCase();
                const choreNameLower = chore.name.toLowerCase();
                if (!choreNameLower.includes(searchTermLower)) return false;
            }

            return true;
        });
    }, [processedChores, filters, entries, today]);


    const sortedChores = useMemo(() => {
        return [...filteredChores].sort((a, b) => {
            let comparison = 0;
            switch (sortOption) {
                case 'choreName':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'timeLeft':
                    comparison = a.nextDueDate.valueOf() - b.nextDueDate.valueOf();
                    break;
                case 'priority':
                    comparison = a.priority - b.priority;
                    break;
                default:
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [filteredChores, sortOption, sortOrder]);

    const sectionedChores: Section[] = useMemo(() => {
        return groupChores(sortedChores, sortOption);
    }, [sortedChores, sortOption]);

    const renderChore = ({ item }: { item: ProcessedChore }) => {
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
                    onDeletePress={() => handleDeleteChore(item.id)}
                    lastCompleted={item.lastCompletedDisplay}
                    timeLeft={item.timeLeft}
                />
            </StyledView>
        );
    };

    const handleEditChore = (choreId: number) => {
        router.push({
            pathname: '/chores/add-edit-chore',
            params: { choreId: choreId.toString() },
        });
    };

    const handleDeleteChore = (choreId: number) => {
        console.log("Delete chore:", choreId);
        // Implementation for deleting a chore
    };

    if (isChoresLoading) {
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
            showHeaderNavOptionButton={false}
            headerTitle={"Chores"}
        >
            <StyledView className="px-2 flex-1">
                <StyledView className="flex w-full pt-2 pb-4 px-4 mb-4 rounded-lg bg-medium">
                    <StyledView className="flex-row justify-between items-center">
                        <StyledView className="flex-1 flex-row items-center">
                            <StyledTouchableOpacity
                                onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                <AntDesign name={sortOrder === 'asc' ? 'arrowup' : 'arrowdown'} size={20} color="white" />
                            </StyledTouchableOpacity>
                            <StyledText className="ml-1 text-primary">Sort</StyledText>
                            <Picker
                                selectedValue={sortOption}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSortOption(itemValue)}
                                dropdownIconColor="white"
                                mode="dropdown"
                            >
                                <Picker.Item label="Chore Name" value="choreName" style={styles.pickerItem} />
                                <Picker.Item label="Due Next" value="timeLeft" style={styles.pickerItem} />
                                <Picker.Item label="Priority" value="priority" style={styles.pickerItem} />
                            </Picker>
                        </StyledView>
                        <StyledTouchableOpacity
                            onPress={() => setFiltersModalVisible(true)}
                            className="ml-4 px-4 py-2 items-end"
                        >
                            <StyledView className="flex-row">
                                <AntDesign name="filter" size={20} color="white" />
                                <StyledText className="ml-1 text-primary">Filters</StyledText>
                            </StyledView>
                        </StyledTouchableOpacity>
                    </StyledView>
                    <TextInputFloatingLabel label="Chore name" value={searchTerm} onChangeText={setSearchTerm}/>
                </StyledView>

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
                        <StyledText className="text-lg text-secondary">No chores found</StyledText>
                    </StyledView>
                )}
            </StyledView>
            <StyledView className="absolute right-4 bottom-4">
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 rounded-full"
                    onPress={() => router.push('/chores/add-edit-chore')}
                    style={{ backgroundColor: Colors.buttonAlternative }}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </StyledTouchableOpacity>
            </StyledView>

            <ChoreFiltersModal
                visible={filtersModalVisible}
                onClose={() => setFiltersModalVisible(false)}
                filters={filters}
                setFilters={setFilters}
                resetFilters={() => setFilters(defaultChoreFilters)}
                tags={tags}
                isTagsLoading={isTagsLoading}
            />

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
        flex: 1,
        color: Colors.textPrimary
    },
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium
    },
});

export default ChoresScreen;
