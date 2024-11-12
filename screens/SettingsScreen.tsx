import {Text, TouchableOpacity, View} from 'react-native';
import {styled} from "nativewind";
import ThemedScreen from "@/components/common/ThemedScreen";
import {router} from "expo-router";
import {AntDesign} from "@expo/vector-icons";
import Container from "@/components/common/Container";
import React from "react";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SettingsScreen = () => {

    const handleTagManagerPress = () => {
        router.push('/settings/tag-manager');
    }

    const handleImportExportPress = () => {
        router.push('/settings/import-export-data');
    }

    const handleCreateReportPress = () => {
        router.push('/settings/report');
    }

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={'Settings'}
        >
            <StyledView className='flex-1 p-2'>
                {/* Manage Tags Button  */}
                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleTagManagerPress}
                    >
                        <StyledText className={`flex-grow text-xl text-primary`}>
                            Manage Tags
                        </StyledText>
                        <StyledView className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                {/* Import/Export Data Button  */}
                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleImportExportPress}
                    >
                        <StyledText className={`flex-grow text-xl text-primary`}>
                            Import/Export Data
                        </StyledText>
                        <StyledView className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>

                {/* Import/Export Data Button  */}
                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleCreateReportPress}
                    >
                        <StyledText className={`flex-grow text-xl text-primary`}>
                            Create A Report
                        </StyledText>
                        <StyledView className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>
            </StyledView>

        </ThemedScreen>
    );
}

export default SettingsScreen;