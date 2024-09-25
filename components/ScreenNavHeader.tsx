import React, { useCallback } from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import { styled } from 'nativewind';
import { router } from "expo-router";
import {AntDesign, Entypo} from "@expo/vector-icons";

// Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Props for the reusable component
type ScreenNavHeaderProps = {
    title?: string;
    onBackPress?: () => void;
    onOptionsPress?: () => void;
    showNavButton?: boolean;
    showOptions?: boolean;
};

const ScreenNavHeader: React.FC<ScreenNavHeaderProps> = ({
                                                             title = '',
                                                             onBackPress = () => router.back(),
                                                             onOptionsPress,
                                                             showNavButton = true,
                                                             showOptions = true
                                                         }) => {

    // Use useCallback for the press handlers
    const handleBackPress = useCallback(() => {
        if (onBackPress) onBackPress();
    }, [onBackPress]);

    const handleOptionsPress = useCallback(() => {
        if (onOptionsPress) onOptionsPress();
    }, [onOptionsPress]);

    return (
        <StyledView className={`flex-row justify-between items-center h-14 px-5`}>
            {showNavButton && (
                <StyledTouchableOpacity onPress={handleBackPress}>
                    <AntDesign name="arrowleft" size={24} color="white"/>
                </StyledTouchableOpacity>
            )}
            <StyledText className="text-white text-lg font-bold">{title}</StyledText>
            {showOptions && (
                <StyledTouchableOpacity onPress={handleOptionsPress}>
                    <Entypo name="dots-three-horizontal" size={24} color="white"/>
                </StyledTouchableOpacity>
            )}
        </StyledView>
    );
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(ScreenNavHeader);
