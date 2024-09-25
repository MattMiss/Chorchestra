import React from 'react';
import { Stack } from 'expo-router';

export default function NoteStack() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="my-chores"  // This refers to "my-chores.tsx" in the chores folder
                options={{ title: 'My Chores' }}
            />
            <Stack.Screen
                name="add-chore"  // This refers to "add-chore.tsx" in the chores folder
                options={{ title: 'Add Chore' }}
            />
        </Stack>
    );
}
