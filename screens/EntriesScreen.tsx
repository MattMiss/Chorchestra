import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {styled} from 'nativewind';
import {Entry} from "@/types";
import {useDataContext} from "@/context/DataContext";
import ThemedScreen from "@/components/common/ThemedScreen";
import {AntDesign} from "@expo/vector-icons";
import AddEditEntryModal from "@/components/modals/AddEditEntryModal";
import EntryCard from "@/components/entries/EntryCard";
import OptionsModal from "@/components/modals/OptionsModal";
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity)


const EntriesScreen = () => {
    const [isEntryModalVisible, setIsEntryModalVisible] = useState<boolean>(false);
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(undefined);

    const {chores, entries, setEntries, isLoading} = useDataContext();

    useEffect(() => {
        //console.log("Chores: ",JSON.stringify(chores, null, 2));
        console.log(entries);
    }, [chores, entries]);

    const handleAddEntryPressed = () => {
        setSelectedEntry(undefined);
        setIsEntryModalVisible(true);
    }

    const handleEditEntryPressed = ( item: Entry) => {
        setSelectedEntry(item);
        setIsEntryModalVisible(true);
    }

    const handleDeleteEntryPressed = ( item: Entry) => {
        setSelectedEntry(item);
        setIsOptionsModalVisible(true);
    }

    const handleCloseEntryModal = () => {
        setSelectedEntry(undefined);
        setIsEntryModalVisible(false);
    }

    const handleDeleteEntry = () => {
        if (selectedEntry){
            // Update the entries state by filtering out the deleted entry
            setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== selectedEntry.id));
            setSelectedEntry(undefined);
        }

    };

    const renderEntry = ({ item }: { item: Entry }) => {
        return (
            <EntryCard
                entry={item}
                chores={chores}
                onEditPress={() => handleEditEntryPressed(item)}
                onDeletePress={() => handleDeleteEntryPressed(item)}
            />
        )
    }

    // If loading, show a spinner
    if (isLoading) {
        return (
            <ThemedScreen
                showHeaderNavButton={false}
                showHeaderNavOptionButton={true}
                headerTitle={"Entries"}
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
            headerTitle={"Entries"}
        >
            <StyledView
                className="px-1 flex-1"
            >
                {/* Check if there are any chores to display */}
                {entries.length > 0 ? (
                    <FlatList
                        data={entries}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderEntry}
                    />
                ) : (
                    <StyledView className="flex-1 justify-center items-center">
                        <StyledText className={`text-lg text-secondary`}>No entries found</StyledText>
                    </StyledView>
                )}
            </StyledView>
            <StyledView className='absolute right-4 bottom-4'>
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 rounded-full"
                    onPress={handleAddEntryPressed}
                    activeOpacity={0.7}
                    accessibilityLabel="Add new entry"
                    style={{backgroundColor: Colors.buttonAlternative}}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </StyledTouchableOpacity>
            </StyledView>

            <AddEditEntryModal
                selectedEntry={selectedEntry}
                visible={isEntryModalVisible}
                onClose={handleCloseEntryModal}
            />

            <OptionsModal
                visible={isOptionsModalVisible}
                onClose={() => setIsOptionsModalVisible(false)}
                option1Text='Delete'
                option2Text='Cancel'
                onOption1Press={handleDeleteEntry}
                onOption2Press={() => setIsOptionsModalVisible(false)}
            />
        </ThemedScreen>
    );
};

export default EntriesScreen;
