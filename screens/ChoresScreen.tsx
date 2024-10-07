import React, {  useEffect } from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {styled} from 'nativewind';
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {Chore, Tag} from "@/types";
import {useDataContext} from "@/context/DataContext";
import ThemedScreen from "@/components/common/ThemedScreen";
import {AntDesign} from "@expo/vector-icons";
import ChoreCard from "@/components/chores/ChoreCard";
import {getTagById} from "@/utils/helpers";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity)


const ChoresScreen = () => {

    const {chores,tags, isLoading} = useDataContext();

    useEffect(() => {
        //console.log("Chores: ",JSON.stringify(chores, null, 2));
    }, [chores]);

    const renderChore = ({ item }: { item: Chore }) => {
        // Get the full Tag objects from the tag IDs
        const tagsForChore = item.tagIds.map((tagId) => getTagById(tags, tagId)).filter(Boolean) as Tag[];

        return (
            <ChoreCard
                chore={item}
                tags={tagsForChore}
                onPress={() => handleChorePress(item.id)}
            />
        )
    }

    const handleChorePress = (choreId: number) => {
        // Navigate to the AddEditChoreScreen and pass the choreId as a parameter
        router.push({
            pathname: '/chores/add-edit-chore',
            params: { choreId: choreId.toString() },
        });
    };

    // If loading, show a spinner
    if (isLoading) {
        return (
            <StyledSafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </StyledSafeAreaView>
        );
    }

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={true}
            headerTitle={"Chores"}
        >
            <StyledView
                className="p-1 flex-grow"
            >
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
            </StyledView>
            <StyledView className='absolute right-4 bottom-4'>
                <StyledTouchableOpacity
                    className="items-center justify-center m-auto w-14 h-14 bg-[#F5103B] rounded-full "
                    onPress={() => router.push('/chores/add-edit-chore')}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </StyledTouchableOpacity>
            </StyledView>
        </ThemedScreen>
    );
};

export default ChoresScreen;
