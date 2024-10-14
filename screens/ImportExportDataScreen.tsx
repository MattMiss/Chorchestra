import React from "react";
import {TouchableOpacity, View, Text, Alert} from "react-native";
import ThemedScreen from "@/components/common/ThemedScreen";
import {styled} from "nativewind";
import {exportData, importData} from "@/utils/dataBackup";
import {useDataContext} from "@/context/DataContext";
import Container from "@/components/common/Container";
import {FontAwesome5} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const ImportExportDataScreen = () => {

    const {chores,setChores, tags, setTags, entries, setEntries} = useDataContext();

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
            <StyledView className='flex-1 p-2'>
                {/* Manage Tags Button  */}
                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleImportData}
                    >
                        <StyledText className={`flex-grow text-xl text-[${Colors.textPrimary}]`}>
                            Import Data
                        </StyledText>
                        <StyledView className="pr-2">
                            <FontAwesome5 name="file-import" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                {/* Import/Export Data Button  */}
                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleExportData}
                    >
                        <StyledText className={`flex-grow text-xl text-[${Colors.textPrimary}]`}>
                            Export Data
                        </StyledText>
                        <StyledView className="">
                            <FontAwesome5 name="file-export" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>
            </StyledView>
        </ThemedScreen>
    )
}

export default ImportExportDataScreen;