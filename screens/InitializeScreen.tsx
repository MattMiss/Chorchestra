import React, { useEffect } from 'react';
import { styled } from 'nativewind';
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import {Colors} from "@/constants/Colors";
import ThemedScreen from "@/components/common/ThemedScreen";
import {useChoresContext} from "@/context/ChoresContext";
import { useTagsContext } from '@/context/TagsContext';
import {useEntriesContext} from "@/context/EntriesContext";

const StyledView = styled(View);

const InitializeScreen = () => {
    const {isChoresLoading} = useChoresContext();
    const {isTagsLoading} = useTagsContext();
    const {isEntriesLoading} = useEntriesContext();

    useEffect(() => {
        if (!isChoresLoading && !isTagsLoading && !isEntriesLoading){
            router.replace('/chores/my-chores');
        }
    }, [isChoresLoading, isTagsLoading, isEntriesLoading, router]);

    if (isChoresLoading || isTagsLoading || isEntriesLoading) {
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
