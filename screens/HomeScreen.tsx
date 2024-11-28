import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styled } from 'nativewind';
import ThemedScreen from '@/components/common/ThemedScreen';
import { AntDesign, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
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
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

type TabType = 'pastDue' | 'dueToday' | 'dueTomorrow' | 'dueInAWeek';

const HomeScreen = () => {
    const { chores } = useChoresContext();
    const { entries } = useEntriesContext();
    const { sections } = useCategorizedChores();

    const [groupedPastDueSection, setGroupedPastDueSection] = useState<{ [key: string]: ProcessedChore[] }>({});
    const [groupedTodaySection, setGroupedTodaySection] = useState<{ [key: string]: ProcessedChore[] }>({});
    const [groupedWithinAWeekSection, setGroupedWithinAWeekSection] = useState<{ [key: string]: ProcessedChore[] }>({});

    const [pastDueCount, setPastDueCount] = useState<Number>(0);
    const [dueTodayCount, setDueTodayCount] = useState<Number>(0);
    const [dueTomorrowCount, setDueTomorrowCount] = useState<Number>(0);
    const [dueInAWeekCount, setDueInAWeekCount] = useState<Number>(0);

    const [modalVisible, setModalVisible] = useState(false);
    
    const [selectedTab, setSelectedTab] = useState<TabType>('dueToday');
    const [selectedSectionTitle, setSelectedSectionTitle] = useState<string>('');
    const [selectedSectionChores, setSelectedSectionChores] = useState<{ [key: string]: ProcessedChore[] }>({});
    const [selectedSectionIcon, setSelectedSectionIcon] = useState<ReactNode>(<AntDesign name="warning" size={20} color={Colors.textPrimary} />);

    const [selectedChore, setSelectedChore] = useState<ProcessedChore | null>(null);
    const [addEditEntryModalVisible, setAddEditEntryModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (sections) {
            const pastDueSection = sections.find(section => section.title === 'Past Due');
            setPastDueCount(pastDueSection ? pastDueSection.data.length : 0);
            setGroupedPastDueSection(pastDueSection ? groupChoresByDate(pastDueSection.data) : {});

            const dueTodaySection = sections.find(section => section.title === 'Due Today');
            setDueTodayCount(dueTodaySection ? dueTodaySection.data.length : 0);
            setGroupedTodaySection(dueTodaySection ? groupChoresByDate(dueTodaySection.data) : {});

            const dueInAWeek = sections.find(section => section.title === 'Due This Week');
            setDueInAWeekCount(dueInAWeek ? dueInAWeek.data.length : 0);
            setGroupedWithinAWeekSection(dueInAWeek ? groupChoresByDate(dueInAWeek.data) : {});
        }
    }, [sections, chores, entries]);

    const handleSectionPress = () => {

        switch(selectedTab){
            case 'pastDue':
                setSelectedSectionTitle("Past Due");
                setSelectedSectionChores(groupedPastDueSection);
                setSelectedSectionIcon(sectionIcon.pastDue);
                break;
            case 'dueToday':
                setSelectedSectionTitle("Due Today");
                setSelectedSectionChores(groupedTodaySection);
                setSelectedSectionIcon(sectionIcon.dueToday);
                break;
            case 'dueTomorrow':
                setSelectedSectionTitle("Due Tomorrow");
                setSelectedSectionChores(groupedTodaySection);
                setSelectedSectionIcon(sectionIcon.dueToday);
                break;
            case 'dueInAWeek':
                setSelectedSectionTitle("Due In A Week");
                setSelectedSectionChores(groupedWithinAWeekSection);
                setSelectedSectionIcon(sectionIcon.dueInAWeek);
                break;
        }

        

        setModalVisible(true);
    };

    const sectionIcon = useMemo(() => ({
        pastDue: <AntDesign name="warning" size={20} color={Colors.iconRed}/>,
        dueToday: <FontAwesome6 name="calendar-day" size={20} color={Colors.iconYellow}/>,
        dueInAWeek: <FontAwesome6 name="calendar-week" size={20} color={Colors.iconGreen}/>
    }), []);

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={"Upcoming Chores"}
        >
            <StyledView className="">
                {/* Tab Navigation */}
                <StyledView className="flex-row justify-around px-2">
                    <StyledTouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'pastDue' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('pastDue')}
                    >
                        {sectionIcon.pastDue}
                        <StyledText className={`ml-2 font-semibold ${selectedTab === 'pastDue' ? 'text-accent' : 'text-primary'}`}>
                            Past Due
                        </StyledText>
                        <StyledText className={`ml-1 font-semibold ${selectedTab === 'pastDue' ? 'text-accent' : 'text-primary'}`}>
                            {`(${pastDueCount.toString()})`}
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'dueToday' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('dueToday')}
                    >
                        {sectionIcon.dueToday}
                        <StyledText className={`ml-2 font-semibold ${selectedTab === 'dueToday' ? 'text-accent' : 'text-primary'}`}>
                            Today
                        </StyledText>
                        <StyledText className={`ml-1 font-semibold ${selectedTab === 'dueToday' ? 'text-accent' : 'text-primary'}`}>
                            {`(${dueTodayCount.toString()})`}
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        className={`flex-1 flex-row items-center justify-center py-2 ${selectedTab === 'dueInAWeek' ? 'border-b-2 border-accent' : ''}`}
                        onPress={() => setSelectedTab('dueInAWeek')}
                    >
                        {sectionIcon.dueInAWeek}
                        <StyledText className={`ml-2 font-semibold ${selectedTab === 'dueInAWeek' ? 'text-accent' : 'text-primary'}`}>
                            In A Week
                        </StyledText>
                        <StyledText className={`ml-1 font-semibold ${selectedTab === 'dueInAWeek' ? 'text-accent' : 'text-primary'}`}>
                            {`(${dueInAWeekCount.toString()})`}
                        </StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>

            {/* Content Area */}
            <StyledView className="flex-1">
                {selectedTab === 'pastDue' ? (
                    <StyledView className="flex-1">
                        {/* Past Due Content */}
                        <ChoreSectionList
                            sectionTitle="Past Due"
                            groupedChores={groupedPastDueSection}
                        />
                    </StyledView>
                ) : selectedTab === 'dueToday' ? (
                    <StyledView className="flex-1">
                        {/* Due Today Content */}
                        <ChoreSectionList
                            sectionTitle="Due Today"
                            groupedChores={groupedTodaySection}
                        />
                    </StyledView>
                ) : selectedTab === 'dueTomorrow' ? (
                    <StyledView className="flex-1">
                        {/* Due Tomorrow Content */}
                    </StyledView>
                ) : selectedTab === 'dueInAWeek' ? (
                    <StyledView className="flex-1">
                        {/* Due In A Week Content */}
                        <ChoreSectionList
                            sectionTitle="Due Within A Week"
                            groupedChores={groupedWithinAWeekSection}
                        />
                    </StyledView>
                ) : (
                    <StyledView className="flex-1">
                        {/* Default Content */}
                    </StyledView>
                )}
            </StyledView>

            <StyledView className="absolute right-4 bottom-4">
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 rounded-full"
                    onPress={handleSectionPress}
                    style={{ backgroundColor: Colors.iconGreen }}
                >
                    <AntDesign name="check" size={30} color="white" />
                </StyledTouchableOpacity>
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
