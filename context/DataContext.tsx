import React, { createContext, useState, useEffect, useRef, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AppState } from 'react-native';
import { debounce } from 'lodash';
import { Chore, Entry, Tag } from "@/types";

// Define the shape of the context data
interface DataContextType {
    chores: Chore[];
    setChores: React.Dispatch<React.SetStateAction<Chore[]>>;
    entries: Entry[];
    setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    isLoading: boolean;
}

// Create the context
export const DataContext = createContext<DataContextType | undefined>(undefined);

// Props for the DataProvider component
interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [chores, setChores] = useState<Chore[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Refs to hold the latest state
    const choresRef = useRef(chores);
    const entriesRef = useRef(entries);
    const tagsRef = useRef(tags);

    // Update the refs whenever state changes
    useEffect(() => {
        choresRef.current = chores;
    }, [chores]);

    useEffect(() => {
        entriesRef.current = entries;
    }, [entries]);

    useEffect(() => {
        tagsRef.current = tags;
    }, [tags]);

    // Define AsyncStorage keys
    const CHORES_KEY = 'chores';
    const ENTRIES_KEY = 'entries';
    const TAGS_KEY = 'tags';

    // Validation functions
    const validateChore = (chore: any): chore is Chore => typeof chore.id === 'number' && typeof chore.name === 'string';
    const validateEntry = (entry: any): entry is Entry => typeof entry.id === 'number' && typeof entry.choreId === 'number';
    const validateTag = (tag: any): tag is Tag => typeof tag.id === 'number' && typeof tag.name === 'string';

    // Load data from AsyncStorage on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const choresData = await AsyncStorage.getItem(CHORES_KEY);
                const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
                const tagsData = await AsyncStorage.getItem(TAGS_KEY);

                // Validate and set chores
                const parsedChores = choresData ? JSON.parse(choresData) : [];
                if (Array.isArray(parsedChores) && parsedChores.every(validateChore)) {
                    setChores(parsedChores);
                } else {
                    setChores([]);
                    Alert.alert('Data Error', 'Failed to load chores data.');
                }

                // Parse entries
                const parsedEntries = entriesData ? JSON.parse(entriesData) : [];
                if (Array.isArray(parsedEntries) && parsedEntries.every(validateEntry)) {
                    setEntries(parsedEntries);
                } else {
                    setEntries([]);
                    Alert.alert('Data Error', 'Failed to load entries data.');
                }

                // Parse tags
                const parsedTags = tagsData ? JSON.parse(tagsData) : [];
                if (Array.isArray(parsedTags) && parsedTags.every(validateTag)) {
                    setTags(parsedTags);
                } else {
                    setTags([]);
                    Alert.alert('Data Error', 'Failed to load tags data.');
                }

            } catch (error) {
                console.error('Error loading data:', error);
                Alert.alert('Data Error', 'An unexpected error occurred while loading data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Save data to AsyncStorage
    const saveData = async () => {
        try {
            await Promise.all([
                AsyncStorage.setItem(CHORES_KEY, JSON.stringify(choresRef.current)),
                AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entriesRef.current)),
                AsyncStorage.setItem(TAGS_KEY, JSON.stringify(tagsRef.current)),
            ]);
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Debounced save function
    const debouncedSaveData = useRef(debounce(saveData, 1000)).current;

    // Use this function for non-debounced saves during critical operations
    const saveDataImmediately = async () => {
        await saveData();
    };

    // Save data when any of the data arrays change
    useEffect(() => {
        if (!isLoading) {
            debouncedSaveData();
        }
    }, [chores, entries, tags]);

    // Save data when app goes to background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState.match(/inactive|background/)) {
                debouncedSaveData.flush();
            }
        });

        return () => {
            subscription.remove();
            debouncedSaveData.cancel();
        };
    }, []);

    return (
        <DataContext.Provider
            value={{
                chores,
                setChores,
                entries,
                setEntries,
                tags,
                setTags,
                isLoading,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
