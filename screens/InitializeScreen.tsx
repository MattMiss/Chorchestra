import React, { useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import {Colors} from "@/constants/Colors";
import ThemedScreen from "@/components/common/ThemedScreen";
import {useDataContext} from "@/context/DataContext";

const StyledView = styled(View);

const InitializeScreen = () => {
    const {isLoading} = useDataContext();

    useEffect(() => {
        if (!isLoading){
            router.replace('/chores/my-chores');
        }
    }, [isLoading, router]);

    if (isLoading) {
        return (
            <ThemedScreen
                showHeaderNavButton={false}
                showHeaderNavOptionButton={false}
            >
                <StyledView className="p-2 flex-grow">
                    <ActivityIndicator size="large" color={Colors.accent} />
                </StyledView>
            </ThemedScreen>
        );
    }

    // Optionally, you can render nothing or a fallback UI here
    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
        >
            <StyledView className="p-2 flex-grow">
                <ActivityIndicator size="large" color={Colors.accent} />
            </StyledView>
        </ThemedScreen>
    );
};

export default InitializeScreen;
