import {Text, TouchableOpacity, View} from 'react-native';
//import {styled} from "nativewind";
import ThemedScreen from "@/components/common/ThemedScreen";
import {router} from "expo-router";
import {AntDesign} from "@expo/vector-icons";
import Container from "@/components/common/Container";
import React from "react";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

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

    const handleNotificationsPress = () => {
        router.push('/settings/notifications');
    }

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={'Settings'}
        >
            <View className='flex-1 p-2'>
                {/* Manage Tags Button  */}
                <Container>
                    <TouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleTagManagerPress}
                    >
                        <Text className={`flex-grow text-xl text-primary`}>
                            Manage Tags
                        </Text>
                        <View className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Container>

                {/* Import/Export Data Button  */}
                <Container>
                    <TouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleImportExportPress}
                    >
                        <Text className={`flex-grow text-xl text-primary`}>
                            Import/Export Data
                        </Text>
                        <View className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Container>

                {/* Import/Export Data Button  */}
                <Container>
                    <TouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleCreateReportPress}
                    >
                        <Text className={`flex-grow text-xl text-primary`}>
                            Create A Report
                        </Text>
                        <View className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Container>

                {/* Notifications Button*/}
                <Container>
                    <TouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleNotificationsPress}
                    >
                        <Text className={`flex-grow text-xl text-primary`}>
                            Notifications
                        </Text>
                        <View className="py-1 pl-5 pr-2">
                            <AntDesign name="right" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Container>
            </View>

        </ThemedScreen>
    );
}

export default SettingsScreen;