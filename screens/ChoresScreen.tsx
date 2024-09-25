import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {getFilteredSortedChores} from '@/database/database';
import {styled} from 'nativewind';
import {SQLRow} from "@/database/types";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity)


const ChoresScreen = () => {
    const [chores, setChores] = useState<SQLRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch chores from the database
    useEffect(() => {
        fetchChores();
    }, []);

    const fetchChores = async () => {
        try {
            // Get chores sorted by days left in ascending order that are tagged with
            // specific IDs and have an importance between 1 and 5
            const choresData = await getFilteredSortedChores(
                'days_left',
                'ASC',
                [1, 2],
                1,
                5,
                'Chore name filter'
            );
            setChores(choresData);
        } catch (error) {
            console.error('Error fetching chores:', error);
        } finally {
            setLoading(false);
        }
    };

    // If loading, show a spinner
    if (loading) {
        return (
            <StyledSafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </StyledSafeAreaView>
        );
    }

    // Render a single chore item
    const renderChore = ({ item }: { item: SQLRow }) => (
        <StyledView className="p-4 mb-4 bg-white rounded-lg shadow-md">
            <StyledText className="text-xl font-semibold">{item.name}</StyledText>
            <StyledText className="text-gray-600">{item.description}</StyledText>

            {/* Display instructions and items needed as lists */}
            <StyledText className="font-semibold mt-2">Instructions:</StyledText>
            {item.instructions && JSON.parse(item.instructions).map((instruction: string, index: number) => (
                <StyledText key={index} className="text-gray-600">
                    {index + 1}. {instruction}
                </StyledText>
            ))}

            <StyledText className="font-semibold mt-2">Items Needed:</StyledText>
            {item.items_needed && JSON.parse(item.items_needed).map((itemNeeded: string, index: number) => (
                <StyledText key={index} className="text-gray-600">
                    - {itemNeeded}
                </StyledText>
            ))}

            <StyledText className="text-xs text-gray-400 mt-2">Status: {item.status}</StyledText>
            <StyledText className="text-xs text-gray-400">Frequency: Every {item.frequency} days</StyledText>
            <StyledText className="text-xs text-gray-400">Importance Level: {item.importance}</StyledText>

            {/* Optionally, show the calculated days left */}
            {item.days_left !== undefined && (
                <StyledText className="text-xs text-red-500">
                    Days left until next completion: {Math.max(0, Math.floor(item.days_left))}
                </StyledText>
            )}
        </StyledView>
    );


    return (
        <StyledSafeAreaView className="flex-1 p-4">
            {/* Check if there are any chores to display */}
            {chores.length > 0 ? (
                <FlatList
                    data={chores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderChore}
                />
            ) : (
                <StyledView className="flex-1 justify-center items-center">
                    <StyledText className="text-gray-500 text-lg">No chores found</StyledText>
                </StyledView>
            )}

            {/* Button to add a new note */}
            <StyledTouchableOpacity
                className="bg-blue-500 p-4 rounded-full mt-4"
                onPress={() => router.push('/chores/add-chore')}
            >
                <StyledText className="text-white text-center">Add A Chore</StyledText>
            </StyledTouchableOpacity>

        </StyledSafeAreaView>
    );
};

export default ChoresScreen;
