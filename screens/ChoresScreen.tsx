import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { styled } from 'nativewind';
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
import OptionsModal from '@/components/modals/OptionsModal';
import { Colors } from "@/constants/Colors";
import { useChoresContext } from "@/context/ChoresContext";
import { useEntriesContext } from "@/context/EntriesContext";
import { useTagsContext } from "@/context/TagsContext";
import TextInputFloatingLabel from "@/components/common/TextInputFloatingLabel";
import {useUserConfigContext} from "@/context/UserConfigContext";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

const defaultChoreFilters = {
    priorities: { 1: true, 2: true, 3: true },
    overdueStatus: 'all',
    lastCompletedStartDate: null as Date | null,
    lastCompletedEndDate: null as Date | null,
    timeLeftRange: [null, null] as [number | null, number | null],
    selectedTags: {} as { [key: number]: boolean },
};

const ChoresScreen = () => {
    const { config, updateConfig } = useUserConfigContext();
    const { chores, deleteChore, isChoresLoading } = useChoresContext();
    const { entries, deleteEntriesByChoreId } = useEntriesContext();
    const { tags, isTagsLoading } = useTagsContext();

    const [selectedChore, setSelectedChore] = useState<ProcessedChore | null>(null);
    const [addEditEntryModalVisible, setAddEditEntryModalVisible] = useState<boolean>(false);
    const [filtersModalVisible, setFiltersModalVisible] = useState<boolean>(false);
    const [deleteChoreModalVisible, setDeleteChoreModalVisible] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState(defaultChoreFilters);
    const [searchTerm, setSearchTerm] = useState('');

    const today = dayjs().startOf('day');

    useEffect(() => {
        if (config){
            setSortOption(config.choreSortBy);
            setSortOrder(config.choreSortOrder);
        }
    }, [config]);

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
            <View className="px-2">
                <ChoreCard
                    chore={item}
                    tags={tagsForChore}
                    onCompletedPress={() => {
                        setSelectedChore(item);
                        setAddEditEntryModalVisible(true);
                    }}
                    onEditPress={() => handleEditChore(item.id)}
                    onDeletePress={() => {
                        setSelectedChore(item);
                        setDeleteChoreModalVisible(true);
                        //handleDeleteChore(item.id)
                    }}
                    lastCompleted={item.lastCompletedDisplay}
                    timeLeft={item.timeLeft}
                />
            </View>
        );
    };

    const handleEditChore = (choreId: number) => {
        router.push({
            pathname: '/chores/add-edit-chore',
            params: { choreId: choreId.toString() },
        });
    };

    const handleDeleteChore = (choreId: number) => {
        deleteEntriesByChoreId(choreId);
        deleteChore(choreId);
    };

    const handleToggleSortOrder = (sortOrder : 'asc' | 'desc') => {
        setSortOrder(sortOrder);
        updateConfig({
            ...config,
            choreSortOrder: sortOrder,
        });
    }

    const handleChangeSortOrder = (sortOption: string) => {
        setSortOption(sortOption);
        updateConfig({
            ...config,
            choreSortBy: sortOption,
        });
    }

    if (isChoresLoading) {
        return (
            <ThemedScreen
                showHeaderNavButton={false}
                showHeaderNavOptionButton={true}
                headerTitle={"Chores"}
            >
                <View className="p-2 flex-grow">
                    <ActivityIndicator size="large" color={Colors.accent} />
                </View>
            </ThemedScreen>
        );
    }

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={"Chores"}
        >
            <View className="px-2 flex-1">
                <View className="flex w-full pt-2 pb-4 px-4 mb-4 rounded-lg bg-medium">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1 flex-row items-center">
                            <TouchableOpacity
                                onPress={() => handleToggleSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                <AntDesign name={sortOrder === 'asc' ? 'arrowup' : 'arrowdown'} size={20} color="white" />
                            </TouchableOpacity>
                            <Text className="ml-1 text-primary">Sort</Text>
                            <Picker
                                selectedValue={sortOption}
                                style={styles.picker}
                                onValueChange={(itemValue) => handleChangeSortOrder(itemValue)}
                                dropdownIconColor="white"
                                mode="dropdown"
                            >
                                <Picker.Item label="Chore Name" value="choreName" style={styles.pickerItem} />
                                <Picker.Item label="Due Next" value="timeLeft" style={styles.pickerItem} />
                                <Picker.Item label="Priority" value="priority" style={styles.pickerItem} />
                            </Picker>
                        </View>
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
                    <TextInputFloatingLabel label="Chore name" value={searchTerm} onChangeText={setSearchTerm}/>
                </View>

                {sectionedChores.length > 0 ? (
                    <SectionList
                        sections={sectionedChores}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderChore}
                        renderSectionHeader={({ section: { title } }) => (
                            <View className="flex-row items-center mt-2 mb-6">
                                <View className="flex-grow bg-sectionTitle h-1 mr-2 mt-1"></View>
                                <Text className="font-bold text-lg text-primary text-center">{title}</Text>
                                <View className="flex-grow bg-sectionTitle h-1 ml-2 mt-1"></View>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-lg text-secondary">No chores found</Text>
                    </View>
                )}
            </View>
            <View className="absolute right-4 bottom-4">
                <TouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 rounded-full"
                    onPress={() => router.push('/chores/add-edit-chore')}
                    style={{ backgroundColor: Colors.buttonAlternative }}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </TouchableOpacity>
            </View>

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

            <OptionsModal 
                visible={deleteChoreModalVisible}
                title={`Delete ${selectedChore?.name} permanently? This will remove all previous entries as well.`}
                option1Text='Yes'
                option2Text='Cancel'
                onOption1Press={() => {
                    if (selectedChore){
                        handleDeleteChore(selectedChore.id);
                    }
                }}
                onOption2Press={() => {
                    setSelectedChore(null);
                    setDeleteChoreModalVisible(false);
                }}
                onClose={() => {
                    setSelectedChore(null);
                    setDeleteChoreModalVisible(false);
                }}
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
