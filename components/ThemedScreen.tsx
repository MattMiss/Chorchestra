import React, {ReactNode, useCallback} from "react";
import { styled, useColorScheme } from "nativewind";
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenNavHeader from "@/components/ScreenNavHeader";
import {router} from "expo-router";
import {KeyboardAvoidingView, View, ScrollView} from "react-native";

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
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const ThemedScreen: React.FC<ThemedScreenProps> = ({
                                                       children,
                                                       showHeaderNavButton = false,
                                                       showHeaderNavOptionButton = false,
                                                       headerTitle = '',
                                                       onHeaderNavBackPress,
                                                       onHeaderNavOptionsPress
                                                   }) => {
    const { colorScheme } = useColorScheme();

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
        <StyledSafeAreaView className='flex-1 '>
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
        </StyledSafeAreaView>
    );
};

export default ThemedScreen;
