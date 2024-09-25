import React from 'react';
import { Stack } from 'expo-router';

export default function NoteStack() {
    return (
        <Stack>
            <Stack.Screen
                name="my-notes"  // This refers to "my-notes.tsx" in the notes folder
                options={{ title: 'My Notes' }}
            />
            <Stack.Screen
                name="add-note"  // This refers to "add-note.tsx" in the notes folder
                options={{ title: 'Add Note' }}
            />
        </Stack>
    );
}
