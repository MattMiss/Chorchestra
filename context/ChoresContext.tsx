// src/contexts/ChoresContext.tsx

import React, { createContext, ReactNode, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chore } from '@/types';
import { Alert } from 'react-native';
import {sortChoresByName} from "@/utils/chores";

interface ChoresContextType {
    chores: Chore[];
    isChoresLoading: boolean;
    isChoresError: boolean;
    addChore: (newChore: Chore) => void;
    editChore: (updatedChore: Chore) => void;
    deleteChore: (choreId: number) => void;
    setChores: (chores: Chore[]) => void;
}

// Create the context
const ChoresContext = createContext<ChoresContextType | undefined>(undefined);

interface ChoresProviderProps {
    children: ReactNode;
}

const CHORES_KEY = 'chores';

const validateChore = (chore: any): chore is Chore =>
    typeof chore.id === 'number' && typeof chore.name === 'string';

const fetchChores = async (): Promise<Chore[]> => {
    const choresData = await AsyncStorage.getItem(CHORES_KEY);
    const parsedChores = choresData ? JSON.parse(choresData) : [];
    if (Array.isArray(parsedChores) && parsedChores.every(validateChore)) {
        return sortChoresByName(parsedChores);
    } else {
        throw new Error('Invalid chores data');
    }
};

const saveChoresToStorage = async (chores: Chore[]): Promise<void> => {
    await AsyncStorage.setItem(CHORES_KEY, JSON.stringify(chores));
};

export const ChoresProvider: React.FC<ChoresProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: chores = [], isLoading: isChoresLoading, isError: isChoresError } = useQuery<Chore[], Error>({
        queryKey: ['chores'],
        queryFn: fetchChores,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const saveChoresMutation = useMutation<void, Error, Chore[]>({
        mutationFn: saveChoresToStorage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chores'] });
            console.log('Chores saved successfully');
        },
        onError: (error: Error) => {
            console.error('Error saving chores:', error);
            Alert.alert('Data Error', 'Failed to save chores data.');
        },
    });

    // Add a new chore
    const addChore = useCallback(
        (newChore: Chore) => {
            if (!chores) return;

            const updatedChores = [...chores, newChore];
            saveChoresMutation.mutate(updatedChores);
        },
        [chores, saveChoresMutation]
    );

    // Edit an existing chore
    const editChore = useCallback(
        (updatedChore: Chore) => {
            if (!chores) return;

            const updatedChores = chores.map(chore =>
                chore.id === updatedChore.id ? updatedChore : chore
            );
            saveChoresMutation.mutate(updatedChores);
        },
        [chores, saveChoresMutation]
    );

    // Delete a chore
    const deleteChore = useCallback(
        (choreId: number) => {
            if (!chores) return;

            const updatedChores = chores.filter(chore => chore.id !== choreId);
            saveChoresMutation.mutate(updatedChores);
        },
        [chores, saveChoresMutation]
    );

    // Set all chores (e.g., for importing data)
    const setChores = useCallback(
        (newChores: Chore[]) => {
            queryClient.setQueryData(['chores'], newChores);
            saveChoresMutation.mutate(newChores);
        },
        [saveChoresMutation]
    );

    return (
        <ChoresContext.Provider value={{ chores, isChoresLoading, isChoresError, addChore, editChore, deleteChore, setChores }}>
            {children}
        </ChoresContext.Provider>
    );
};

// Custom hook to use the ChoresContext
export const useChoresContext = () => {
    const context = useContext(ChoresContext);
    if (context === undefined) {
        throw new Error('useChoresContext must be used within a ChoresProvider');
    }
    return context;
};
