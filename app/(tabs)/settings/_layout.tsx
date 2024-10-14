import React from 'react';
import { Stack } from 'expo-router';

export default function NoteStack() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="index"
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="tag-manager"
                options={{ title: 'Tag Manager' }}
            />
            <Stack.Screen
                name="import-export-data"
                options={{ title: 'Import/Export Data' }}
            />
        </Stack>
    );
}
