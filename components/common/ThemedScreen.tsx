import React, {ReactNode, useCallback} from "react";
import { styled, useColorScheme } from "nativewind";
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenNavHeader from "@/components/common/ScreenNavHeader";
import {router} from "expo-router";
import { View } from "react-native";
import {StatusBar} from "expo-status-bar";

// Define the type for the props to include children
interface ThemedScreenProps {
    children: ReactNode;
    showHeaderNavButton?: boolean;
    showHeaderNavOptionButton?: boolean;
    headerTitle?: string;
    onHeaderNavBackPress?: () => void;
    onHeaderNavOptionsPress?: () => void;
}

// Create a styled version of SafeAreaView using NativeWind
const StyledView = styled(View);

const ThemedScreen: React.FC<ThemedScreenProps> = ({
                                                       children,
                                                       showHeaderNavButton = false,
                                                       showHeaderNavOptionButton = false,
                                                       headerTitle = '',
                                                       onHeaderNavBackPress,
                                                       onHeaderNavOptionsPress
                                                   }) => {
    //const { colorScheme } = useColorScheme();

    // Memoize the onHeaderNavBackPress and onHeaderNavOptionsPress callbacks
    const handleBackPress = useCallback(() => {
        if (onHeaderNavBackPress) {
            onHeaderNavBackPress();
        } else {
            router.back(); // Fallback if no custom onBackPress is provided
        }
    }, [onHeaderNavBackPress]);


    const handleOptionsPress = useCallback(() => {
        if (onHeaderNavOptionsPress) {
            onHeaderNavOptionsPress();
        }
    }, [onHeaderNavOptionsPress]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar style={'light'} backgroundColor="#000000"/>
            <StyledView className='flex-1 bg-gray-900'>
                <ScreenNavHeader
                    showNavButton={showHeaderNavButton}
                    showOptions={showHeaderNavOptionButton}
                    title={headerTitle}
                    onBackPress={handleBackPress}
                    onOptionsPress={handleOptionsPress}
                />
                <StyledView className='flex-grow'>
                    {children}
                </StyledView>
            </StyledView>
        </SafeAreaView>
    );
};

export default ThemedScreen;
