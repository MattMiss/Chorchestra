import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
//import { styled } from 'nativewind';

// Styled view for background color
//const View = styled(View);

export default function TabLayout() {
    return (
        <View  className='flex-1 bg-dark'>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#F7FAFF',  // White for active icons/text
                    tabBarInactiveTintColor: '#858E9F', // Grey for inactive icons/text
                    tabBarStyle: {
                        backgroundColor: '#1C1F26',  // Black background for tab bar
                        borderTopColor: '#383838',
                        borderTopWidth: 0.5,
                        shadowOpacity: 0,  // Remove shadow on iOS
                        height: 60,
                    },
                    tabBarItemStyle: {
                        paddingTop: 4
                    },
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="home" size={30} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="entries"
                    options={{
                        title: 'Entries',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="area-chart" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="chores"
                    options={{
                        title: 'Chores',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="tasks" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="cog" size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
