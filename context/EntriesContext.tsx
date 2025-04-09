// src/contexts/EntriesContext.tsx

import React, { createContext, ReactNode, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Entry} from '@/types';
import { Alert } from 'react-native';

interface EntriesContextType {
    entries: Entry[];
    isEntriesLoading: boolean;
    isEntriesError: boolean;
    addEntry: (newEntry: Entry) => void;
    editEntry: (updatedEntry: Entry) => void;
    deleteEntry: (entryId: number) => void;
    deleteEntriesByChoreId: (choreId: number) => void;
    setEntries: (entries: Entry[]) => void;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

interface EntriesProviderProps {
    children: ReactNode;
}

const ENTRIES_KEY = 'entries';

const validateEntry = (entry: any): entry is Entry =>
    typeof entry.id === 'number' && typeof entry.choreId === 'number';

const fetchEntries = async (): Promise<Entry[]> => {
    const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
    const parsedEntries = entriesData ? JSON.parse(entriesData) : [];
    if (Array.isArray(parsedEntries) && parsedEntries.every(validateEntry)) {
        return parsedEntries;
    } else {
        throw new Error('Invalid entries data');
    }
};

const saveEntriesToStorage = async (entries: Entry[]): Promise<void> => {
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

export const EntriesProvider: React.FC<EntriesProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: entries = [], isLoading: isEntriesLoading, isError: isEntriesError } = useQuery<Entry[], Error>({
        queryKey: ['entries'],
        queryFn: fetchEntries,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const saveEntriesMutation = useMutation<void, Error, Entry[]>({
        mutationFn: saveEntriesToStorage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entries'] });
            console.log('Entries saved successfully');
        },
        onError: (error: Error) => {
            console.error('Error saving entries:', error);
            Alert.alert('Data Error', 'Failed to save entries data.');
        },
    });

    // Add a new entry
    const addEntry = useCallback(
        (newEntry: Entry) => {
            if (!entries) return;

            const updatedEntries = [...entries, newEntry];
            saveEntriesMutation.mutate(updatedEntries);
        },
        [entries, saveEntriesMutation]
    );

    // Edit an existing entry
    const editEntry = useCallback(
        (updatedEntry: Entry) => {
            if (!entries) return;

            const updatedEntries = entries.map(entry =>
                entry.id === updatedEntry.id ? updatedEntry : entry
            );
            saveEntriesMutation.mutate(updatedEntries);
        },
        [entries, saveEntriesMutation]
    );

    // Delete an entry
    const deleteEntry = useCallback(
        (entryId: number) => {
            if (!entries) return;

            const updatedEntries = entries.filter(entry => entry.id !== entryId);
            saveEntriesMutation.mutate(updatedEntries);
        },
        [entries, saveEntriesMutation]
    );

    // Delete all entries with a specific choreId
    const deleteEntriesByChoreId = useCallback(
        (choreId: number) => {
            if (!entries) return;

            const updatedEntries = entries.filter(entry => entry.choreId !== choreId);
            saveEntriesMutation.mutate(updatedEntries);
        },
        [entries, saveEntriesMutation]
    );

    // Set all entries (e.g., for importing data)
    const setEntries = useCallback(
        (newEntries: Entry[]) => {
            queryClient.setQueryData(['entries'], newEntries);
            saveEntriesMutation.mutate(newEntries);
        },
        [saveEntriesMutation]
    );

    return (
        <EntriesContext.Provider value={{ entries, isEntriesLoading, isEntriesError, addEntry, editEntry, deleteEntry, deleteEntriesByChoreId, setEntries }}>
            {children}
        </EntriesContext.Provider>
    );
};

// Custom hook to use the EntriesContext
export const useEntriesContext = () => {
    const context = useContext(EntriesContext);
    if (context === undefined) {
        throw new Error('useEntriesContext must be used within an EntriesProvider');
    }
    return context;
};
