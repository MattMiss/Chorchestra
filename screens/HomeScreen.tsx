import React, {ReactNode, useEffect, useMemo, useState} from 'react';
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
    const [selectedSectionIcon, setSelectedSectionIcon] = useState<ReactNode>(<AntDesign name="warning" size={20} color={Colors.textPrimary} />);

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

    const handleSectionPress = (title: string, groupedChores: { [key: string]: ProcessedChore[] }, sectionIcon: ReactNode) => {
        setSelectedSectionTitle(title);
        setSelectedSectionChores(groupedChores);
        setSelectedSectionIcon(sectionIcon);

        setModalVisible(true);
    };

    const sectionIcon = useMemo(() => ({
        pastDue: <AntDesign name="warning" size={24} color={Colors.iconRed}/>,
        dueToday: <FontAwesome6 name="calendar-day" size={24} color={Colors.iconYellow}/>,
        dueInAWeek: <FontAwesome6 name="calendar-week" size={24} color={Colors.iconGreen}/>
    }), []);

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={""}
        >
            <StyledView className="px-2 flex-1 justify-between">
                {/* Chores SectionList with grouped data */}
                <StyledView className="flex-1 flex-row justify-between">
                    <ChoreSectionList
                        sectionClassName="mr-2"
                        sectionTitle="Past Due"
                        groupedChores={groupedPastDueSection}
                        icon={sectionIcon.pastDue}
                        onPress={() => handleSectionPress(
                            'Past Due',
                            groupedPastDueSection,
                            sectionIcon.pastDue
                        )}
                    />
                    <ChoreSectionList
                        sectionClassName={"ml-2"}
                        sectionTitle="Due Today"
                        groupedChores={groupedTodaySection}
                        icon={sectionIcon.dueToday}
                        onPress={() => handleSectionPress(
                            'Due Today',
                            groupedTodaySection,
                            sectionIcon.dueToday
                        )}
                    />
                </StyledView>

                <ChoreSectionList
                    sectionClassName="p-4"
                    sectionTitle="Due Within A Week"
                    groupedChores={groupedWithinAWeekSection}
                    icon={sectionIcon.dueInAWeek}
                    onPress={() => handleSectionPress(
                        'Due Within A Week',
                        groupedWithinAWeekSection,
                        sectionIcon.dueInAWeek
                    )}
                />
            </StyledView>

            {/* Chore List Modal with grouped data */}
            <ChoreListModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                sectionTitle={selectedSectionTitle}
                sectionIcon={selectedSectionIcon}
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
