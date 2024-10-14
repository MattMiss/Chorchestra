import React from 'react';
import { Stack } from 'expo-router';

export default function EntriesStack() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="my-entries"  // This refers to "my-chores.tsx" in the chores folder
                options={{ title: 'Entries' }}
            />
        </Stack>
    );
}
