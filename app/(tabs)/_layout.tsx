import { Tabs } from 'expo-router';
import React from 'react';
import {FontAwesome} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#F7FAFF',  // White for active icons/text
                tabBarInactiveTintColor: '#858E9F', // Grey for inactive icons/text
                tabBarStyle: {
                    backgroundColor: '#1C1F26',  // Black background for tab bar
                    borderTopWidth: 0,  // Remove the border line
                    elevation: 0,  // Remove shadow on Android
                    shadowOpacity: 0,  // Remove shadow on iOS
                },
                tabBarItemStyle:{
                    padding: 4
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="entries"
                options={{
                    title: 'Entries',
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome name="cog" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chores"
                options={{
                    title: 'Chores',
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome name="tasks" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome name="cog" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
