import React, { useEffect } from 'react';
import {styled} from 'nativewind';
import {createTables, migrateAddFrequencyType} from '@/database/database';
import {Text, View} from "react-native";
import {router} from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);

const App = () => {

    useEffect(() => {

        const initializeDatabase = async () => {
            await migrateAddFrequencyType();

            try {
                // Call the createTables function to set up the database tables
                await createTables();
                console.log('Database initialized successfully');
                router.replace('/chores/my-chores')
            } catch (error) {
                console.error('Error initializing database:', error);
            }
        };

        initializeDatabase(); // Call the async function
    }, []); // Empty dependency array ensures this runs only once when the app loads

    return (
        <StyledView className="flex-1 justify-center items-center">
            <StyledText className="text-xl">Chores Tracking App</StyledText>
        </StyledView>
    );
};

export default App;
