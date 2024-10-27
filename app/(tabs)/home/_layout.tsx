import React from 'react';
import { Stack } from 'expo-router';

export default function HomeStack() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="home-screen"
                options={{ title: 'Home' }}
            />
        </Stack>
    );
}
