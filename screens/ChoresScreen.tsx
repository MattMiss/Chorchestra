import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import { getAllNotes } from '../database/database';
import {styled} from 'nativewind';
import {SQLRow} from "@/database/types";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity)


const NotesScreen = () => {
    const [notes, setNotes] = useState<SQLRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setModalVisible] = useState(false);

    // Fetch chores from the database
    useEffect(() => {

        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const notesData = await getAllNotes();
            setNotes(notesData);
        } catch (error) {
            console.error('Error fetching chores:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => setModalVisible(true);
    const closeModal = () => {
        setModalVisible(false);
        fetchNotes(); // Refresh the list after adding a new note
    };

    // If loading, show a spinner
    if (loading) {
        return (
            <StyledSafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </StyledSafeAreaView>
        );
    }

    // Render a single note item
    const renderNote = ({ item }: { item: SQLRow }) => (
        <StyledView className="p-4 mb-4 bg-white rounded-lg shadow-md">
            <StyledText className="text-xl font-semibold">{item.title}</StyledText>
            <StyledText className="text-gray-600">{item.content}</StyledText>
            <StyledText className="text-xs text-gray-400">Status: {item.status}</StyledText>
        </StyledView>
    );

    return (
        <StyledSafeAreaView className="flex-1 p-4">
            {/* Check if there are any chores to display */}
            {notes.length > 0 ? (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderNote}
                />
            ) : (
                <StyledView className="flex-1 justify-center items-center">
                    <StyledText className="text-gray-500 text-lg">No notes found</StyledText>
                </StyledView>
            )}

            {/* Button to add a new note */}
            <StyledTouchableOpacity
                className="bg-blue-500 p-4 rounded-full mt-4"
                onPress={() => router.push('/notes/add-note')}
            >
                <StyledText className="text-white text-center">Add New Note</StyledText>
            </StyledTouchableOpacity>

            {/* Add Note Modal */}
            {/*<AddNoteModal visible={isModalVisible} onClose={closeModal} />*/}
        </StyledSafeAreaView>
    );
};

export default NotesScreen;
