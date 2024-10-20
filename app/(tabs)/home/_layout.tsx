import React from 'react';
import { Stack } from 'expo-router';

export default function HomeStack() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="home-screen"  // This refers to "my-chores.tsx" in the chores folder
                options={{ title: 'Home' }}
            />
        </Stack>
    );
}
