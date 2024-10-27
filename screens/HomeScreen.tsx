// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { useDataContext } from '@/context/DataContext';
import ThemedScreen from '@/components/common/ThemedScreen';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import ChoreSectionList from '@/components/chores/ChoreSectionList';
import ChoreListModal from '@/components/modals/ChoreListModal';
import useCategorizedChores from '@/hooks/useCategorizedChores';
import { Colors } from "@/constants/Colors";
import {ProcessedChore} from "@/types";
import AddEditEntryModal from "@/components/modals/AddEditEntryModal";

const StyledView = styled(View);

const HomeScreen = () => {
    const { chores, entries } = useDataContext();
    const { sections } = useCategorizedChores();

    const [pastDueSection, setPastDueSection] = useState<ProcessedChore[]>([]);
    const [todaySection, setTodaySection] = useState<ProcessedChore[]>([]);
    const [withinAWeekSection, setInAWeekSection] = useState<ProcessedChore[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSectionTitle, setSelectedSectionTitle] = useState<string>('');
    const [selectedSectionChores, setSelectedSectionChores] = useState<ProcessedChore[]>([]);

    const [selectedChore, setSelectedChore] = useState<ProcessedChore | null>(null);
    const [addEditEntryModalVisible, setAddEditEntryModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (sections){
            const pastDueSection = sections.find(section => section.title === 'Past Due');
            setPastDueSection(pastDueSection ? pastDueSection.data : []);
            const dueTodaySection = sections.find(section => section.title === 'Due Today');
            setTodaySection(dueTodaySection ? dueTodaySection.data : []);
            const dueThisWeek = sections.find(section => section.title === 'Due This Week');
            setInAWeekSection(dueThisWeek ? dueThisWeek.data : []);
        }
    }, [sections, chores, entries]);

    const handleSectionPress = (title: string, chores: ProcessedChore[]) => {
        setSelectedSectionTitle(title);
        setSelectedSectionChores(chores);
        setModalVisible(true);
    };

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={"Home"}
        >
            <StyledView className="px-2 flex-1">
                {/* Chores SectionList */}
                <ChoreSectionList
                    sectionTitle="Chores Past Due"
                    chores={pastDueSection}
                    icon={<AntDesign name="warning" size={24} color={Colors.textPrimary} />}
                    onPress={() => handleSectionPress('Past Due', pastDueSection)}
                />
                <ChoreSectionList
                    sectionTitle="Chores Due Today"
                    chores={todaySection}
                    icon={<FontAwesome6 name="calendar-day" size={24} color={Colors.textPrimary} />}
                    onPress={() => handleSectionPress('Due Today', todaySection)}
                />
                <ChoreSectionList
                    sectionTitle="Chores Due Within A Week"
                    chores={withinAWeekSection}
                    icon={<FontAwesome6 name="calendar-week" size={24} color={Colors.textPrimary} />}
                    onPress={() => handleSectionPress('Due Within A Week', withinAWeekSection)}
                />
            </StyledView>

            {/* Chore List Modal */}
            <ChoreListModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                sectionTitle={selectedSectionTitle}
                chores={selectedSectionChores}
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
