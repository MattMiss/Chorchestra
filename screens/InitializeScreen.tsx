import React, { useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { View, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import {Colors} from "@/constants/Colors";
import ThemedScreen from "@/components/common/ThemedScreen";

const StyledView = styled(View);

const App = () => {
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                router.replace('/home/home-screen');
            } catch (error) {
                console.error('Error initializing database:', error);
                Alert.alert(
                    "Initialization Error",
                    "An error occurred while setting up the database. Please restart the app.",
                    [{ text: "OK" }]
                );
            } finally {
                setIsInitializing(false);
            }
        };

        initializeDatabase();
    }, []);

    if (isInitializing) {
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

export default App;
