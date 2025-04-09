import React from "react";
import {TouchableOpacity, View, Text, Alert} from "react-native";
import ThemedScreen from "@/components/common/ThemedScreen";
//import {styled} from "nativewind";
import {exportData, importData} from "@/utils/dataBackup";
import Container from "@/components/common/Container";
import {FontAwesome5} from "@expo/vector-icons";
import {useChoresContext} from "@/context/ChoresContext";
import {useTagsContext} from "@/context/TagsContext";
import {useEntriesContext} from "@/context/EntriesContext";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

const ImportExportDataScreen = () => {
    // Access chores, tags, and entries contexts
    const { chores, setChores } = useChoresContext();
    const { tags, setTags } = useTagsContext();
    const { entries, setEntries } = useEntriesContext();

    const handleExportData = async () => {
        try {
            const backupData = { chores, tags, entries };
            await exportData(backupData);
            Alert.alert('Success', 'Data successfully exported.');
        } catch (error) {
            Alert.alert('Error', 'Failed to export data.');
        }
    };

    const handleImportData = async () => {
        try {
            const data = await importData();
            if (data) {
                setChores(data.chores);
                setTags(data.tags);
                setEntries(data.entries);
                Alert.alert('Success', 'Data successfully imported.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to import data.');
        }
    };

    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={false}
            headerTitle={'Import/Export Data'}
        >
            <View className='flex-1 p-2'>
                {/* Import Data Button */}
                <Container>
                    <TouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleImportData}
                    >
                        <Text className={`flex-grow text-xl text-primary`}>
                            Import Data
                        </Text>
                        <View className="pr-2">
                            <FontAwesome5 name="file-import" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Container>

                {/* Export Data Button */}
                <Container>
                    <TouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleExportData}
                    >
                        <Text className={`flex-grow text-xl text-primary`}>
                            Export Data
                        </Text>
                        <View className="">
                            <FontAwesome5 name="file-export" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Container>
            </View>
        </ThemedScreen>
    );
};

export default ImportExportDataScreen;
