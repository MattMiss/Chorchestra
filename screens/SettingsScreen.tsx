import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import ThemedScreen from "@/components/common/ThemedScreen";
import {router} from "expo-router";
import {useDataContext} from "@/context/DataContext";
import {AntDesign} from "@expo/vector-icons";
import Container from "@/components/common/Container";
import React from "react";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SettingsScreen = () => {

    const { tags } = useDataContext();

    const handleTagManagerPress = () => {
        router.push('/settings/tag-manager');
    }

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={true}
            headerTitle={'Settings'}
        >
            <StyledView className='flex-1 p-2'>
                <Container>
                    <StyledTouchableOpacity
                        className="flex-row items-center min-h-[50]"
                        onPress={handleTagManagerPress}
                    >
                        <StyledText className="flex-grow text-xl text-gray-400">
                            Manage Tags
                        </StyledText>
                        <StyledView className="py-1 pl-5 pr-2">
                            <AntDesign name="form" size={24} color="white" />
                        </StyledView>
                    </StyledTouchableOpacity>
                </Container>
            </StyledView>

        </ThemedScreen>
    );
}

export default SettingsScreen;