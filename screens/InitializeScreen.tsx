import React, { useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { Text, View, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";


const StyledView = styled(View);
const StyledText = styled(Text);

const App = () => {
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                // // Step 1: Create necessary tables
                // await createTables(db);
                // console.log('Tables created successfully');
                //
                // // Step 2: Apply migrations
                // //await migrateAddFrequencyType(db);
                // console.log('Migrations applied successfully');

                // Step 3: Navigate to the main screen
                router.replace('/chores/my-chores');
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
            <StyledView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <StyledText className="text-xl mt-4">Initializing App...</StyledText>
            </StyledView>
        );
    }

    // Optionally, you can render nothing or a fallback UI here
    return (
        <StyledView className="flex-1 justify-center items-center">
            <StyledText className="text-xl">Chores Tracking App</StyledText>
        </StyledView>
    );
};

export default App;
