import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import {styled} from 'nativewind';
import {SQLRow} from "@/database/types";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {Chore} from "@/types";
import {useDataContext} from "@/context/DataContext";
import ThemedScreen from "@/components/ThemedScreen";
import {AntDesign} from "@expo/vector-icons";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity)


const ChoresScreen = () => {

    const {chores, isLoading} = useDataContext();

    useEffect(() => {
        console.log("Chores: ",chores);
    }, [chores]);

    // If loading, show a spinner
    if (isLoading) {
        return (
            <StyledSafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </StyledSafeAreaView>
        );
    }

    // // Render a single chore item
    // const renderChore = ({ item }: { item: SQLRow }) => (
    //     <StyledView className="p-4 mb-4 bg-white rounded-lg shadow-md">
    //         <StyledText className="text-xl font-semibold">{item.name}</StyledText>
    //         <StyledText className="text-gray-600">{item.description}</StyledText>
    //
    //         {/* Display instructions and items needed as lists */}
    //         <StyledText className="font-semibold mt-2">Instructions:</StyledText>
    //         {item.instructions && JSON.parse(item.instructions).map((instruction: string, index: number) => (
    //             <StyledText key={index} className="text-gray-600">
    //                 {index + 1}. {instruction}
    //             </StyledText>
    //         ))}
    //
    //         <StyledText className="font-semibold mt-2">Items Needed:</StyledText>
    //         {item.items_needed && JSON.parse(item.items_needed).map((itemNeeded: string, index: number) => (
    //             <StyledText key={index} className="text-gray-600">
    //                 - {itemNeeded}
    //             </StyledText>
    //         ))}
    //
    //         <StyledText className="text-xs text-gray-400 mt-2">Status: {item.status}</StyledText>
    //         <StyledText className="text-xs text-gray-400">Frequency: Every {item.frequency} days</StyledText>
    //         <StyledText className="text-xs text-gray-400">Importance Level: {item.importance}</StyledText>
    //
    //         {/* Optionally, show the calculated days left */}
    //         {item.days_left !== undefined && (
    //             <StyledText className="text-xs text-red-500">
    //                 Days left until next completion: {Math.max(0, Math.floor(item.days_left))}
    //             </StyledText>
    //         )}
    //     </StyledView>
    // );


    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={true}
            headerTitle={"Chores"}
        >
            <StyledScrollView
                className="p-2 flex-grow"
                contentContainerStyle={{ paddingBottom: 30 }} // Adjust the value as needed
            >
                {/*/!* Check if there are any chores to display *!/*/}
                {/*{chores.length > 0 ? (*/}
                {/*    <FlatList*/}
                {/*        data={chores}*/}
                {/*        keyExtractor={(item) => item.id.toString()}*/}
                {/*        renderItem={renderChore}*/}
                {/*    />*/}
                {/*) : (*/}
                {/*    <StyledView className="flex-1 justify-center items-center">*/}
                {/*        <StyledText className="text-gray-500 text-lg">No chores found</StyledText>*/}
                {/*    </StyledView>*/}
                {/*)}*/}

                {/* Button to add a new note */}



            </StyledScrollView>
            <StyledView className='absolute right-4 bottom-4'>
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 bg-blue-500 rounded-full "
                    onPress={() => router.push('/chores/add-chore')}
                >
                    <AntDesign name="plus" size={40} color="white" />
                </StyledTouchableOpacity>
            </StyledView>
        </ThemedScreen>
    );
};

export default ChoresScreen;
