// app/index.js
import {router} from 'expo-router';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {styled} from "nativewind";
import {useEffect, useState} from "react";
import {createTables} from "@/database/database";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const HomeScreen = () => {
    const [isLoadingTables, setIsLoadingTables] = useState<boolean>(true);

    useEffect(() => {
        setIsLoadingTables(true);
        createTables().then(r => {
            setIsLoadingTables(false);
        });
    }, []);

    // If loading, show a spinner
    if (isLoadingTables) {
        return (
            <StyledView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </StyledView>
        );
    }

    return (
        <StyledView className="flex-1 w-100 items-center justify-center">
            <StyledText className="text-xl font-bold text-center bg-black-400">Welcome to Brain Companion</StyledText>
            <StyledTouchableOpacity onPress={() => router.push("/chores")} disabled={isLoadingTables}>
                <StyledText className="text-blue-500 mt-4 text-center">Go to Notes</StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    );
}

export default HomeScreen;