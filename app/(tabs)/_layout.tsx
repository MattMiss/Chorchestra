import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FFFFFF',  // White for active icons/text
                tabBarInactiveTintColor: '#808080', // Grey for inactive icons/text
                tabBarStyle: {
                    backgroundColor: '#000000',  // Black background for tab bar
                    borderTopWidth: 0,  // Remove the border line
                    elevation: 0,  // Remove shadow on Android
                    shadowOpacity: 0,  // Remove shadow on iOS
                },
                headerShown: false,  // Hide the header
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="chores"
                options={{
                    title: 'Notes',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
