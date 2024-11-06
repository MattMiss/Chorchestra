import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import ThemedScreen from '@/components/common/ThemedScreen';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import ChoreSectionList from '@/components/chores/ChoreSectionList';
import ChoreListModal from '@/components/modals/ChoreListModal';
import useCategorizedChores from '@/hooks/useCategorizedChores';
import { Colors } from "@/constants/Colors";
import { ProcessedChore} from "@/types";
import {groupChoresByDate} from '@/utils/chores';
import AddEditEntryModal from "@/components/modals/AddEditEntryModal";
import { useChoresContext } from "@/context/ChoresContext";
import { useEntriesContext } from "@/context/EntriesContext";

const StyledView = styled(View);

const HomeScreen = () => {
    const { chores } = useChoresContext();
    const { entries } = useEntriesContext();
    const { sections } = useCategorizedChores();

    const [groupedPastDueSection, setGroupedPastDueSection] = useState<{ [key: string]: ProcessedChore[] }>({});
    const [groupedTodaySection, setGroupedTodaySection] = useState<{ [key: string]: ProcessedChore[] }>({});
    const [groupedWithinAWeekSection, setGroupedWithinAWeekSection] = useState<{ [key: string]: ProcessedChore[] }>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSectionTitle, setSelectedSectionTitle] = useState<string>('');
    const [selectedSectionChores, setSelectedSectionChores] = useState<{ [key: string]: ProcessedChore[] }>({});

    const [selectedChore, setSelectedChore] = useState<ProcessedChore | null>(null);
    const [addEditEntryModalVisible, setAddEditEntryModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (sections) {
            const pastDueSection = sections.find(section => section.title === 'Past Due');
            setGroupedPastDueSection(pastDueSection ? groupChoresByDate(pastDueSection.data) : {});

            const dueTodaySection = sections.find(section => section.title === 'Due Today');
            setGroupedTodaySection(dueTodaySection ? groupChoresByDate(dueTodaySection.data) : {});

            const dueThisWeek = sections.find(section => section.title === 'Due This Week');
            setGroupedWithinAWeekSection(dueThisWeek ? groupChoresByDate(dueThisWeek.data) : {});
        }
    }, [sections, chores, entries]);

    const handleSectionPress = (title: string, groupedChores: { [key: string]: ProcessedChore[] }) => {
        setSelectedSectionTitle(title);
        setSelectedSectionChores(groupedChores);
        setModalVisible(true);
    };

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={"Home"}
        >
            <StyledView className="px-2 flex-1 justify-between">
                {/* Chores SectionList with grouped data */}
                <ChoreSectionList
                    sectionTitle="Chores Past Due"
                    groupedChores={groupedPastDueSection}
                    icon={<AntDesign name="warning" size={24} color={Colors.iconRed} />}
                    onPress={() => handleSectionPress('Past Due', groupedPastDueSection)}
                />
                <ChoreSectionList
                    sectionTitle="Chores Due Today"
                    groupedChores={groupedTodaySection}
                    icon={<FontAwesome6 name="calendar-day" size={24} color={Colors.iconYellow} />}
                    onPress={() => handleSectionPress('Due Today', groupedTodaySection)}
                />
                <ChoreSectionList
                    sectionTitle="Chores Due Within A Week"
                    groupedChores={groupedWithinAWeekSection}
                    icon={<FontAwesome6 name="calendar-week" size={24} color={Colors.iconGreen} />}
                    onPress={() => handleSectionPress('Due Within A Week', groupedWithinAWeekSection)}
                />
            </StyledView>

            {/* Chore List Modal with grouped data */}
            <ChoreListModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                sectionTitle={selectedSectionTitle}
                groupedChores={selectedSectionChores}
                completeChore={(chore) => {
                    setSelectedChore(chore);
                    setModalVisible(false);
                    setAddEditEntryModalVisible(true);
                }}
            />

            {/* AddEditEntryModal for Completing Chores */}
            <AddEditEntryModal
                visible={addEditEntryModalVisible}
                choreId={selectedChore ? selectedChore.id : undefined}
                onClose={() => {
                    setAddEditEntryModalVisible(false);
                }}
            />
        </ThemedScreen>
    );
};

export default HomeScreen;
