import React from 'react';
import { Stack } from 'expo-router';

export default function NoteStack() {
    return (
        <Stack>
            <Stack.Screen
                name="index"  // This refers to "my-chores.tsx" in the chores folder
                options={{ title: 'Settings' }}
            />
        </Stack>
    );
}
