import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
//import { styled } from 'nativewind';
import { router } from "expo-router";
import {AntDesign, Entypo} from "@expo/vector-icons";

// Styled Components
// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

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
        <View className={`flex-row justify-between items-center h-14 px-5`}>
            <View className='flex-shrink min-w-[40] items-start'>
                {showNavButton && (
                    <TouchableOpacity onPress={handleBackPress}>
                        <AntDesign name="arrowleft" size={24} color="white"/>
                    </TouchableOpacity>
                )}
            </View>
            <Text className="flex-grow text-center text-white text-lg font-bold">{title}</Text>
            <View className='flex-shrink min-w-[40] items-end'>
                {showOptions && (
                    <TouchableOpacity onPress={handleOptionsPress}>
                        <Entypo name="dots-three-horizontal" size={24} color="white"/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(ScreenNavHeader);
