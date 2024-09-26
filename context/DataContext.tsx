import React, { createContext, useState, useEffect, useRef, ReactNode, useContext } from 'react';
import * as FileSystem from 'expo-file-system';
import { AppState } from 'react-native';
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

    // Define file URIs
    const choresFileUri = `${FileSystem.documentDirectory}chores.json`;
    const entriesFileUri = `${FileSystem.documentDirectory}entries.json`;
    const tagsFileUri = `${FileSystem.documentDirectory}tags.json`;

    const fileExists = async (uri: string): Promise<boolean> => {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        return fileInfo.exists;
    };

    // Load data from files on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const choresExists = await fileExists(choresFileUri);
                const entriesExists = await fileExists(entriesFileUri);
                const tagsExists = await fileExists(tagsFileUri);

                const [choresData, entriesData, tagsData] = await Promise.all([
                    choresExists ? FileSystem.readAsStringAsync(choresFileUri) : null,
                    entriesExists ? FileSystem.readAsStringAsync(entriesFileUri) : null,
                    tagsExists ? FileSystem.readAsStringAsync(tagsFileUri) : null,
                ]);

                setChores(choresData ? JSON.parse(choresData) : []);
                setEntries(entriesData ? JSON.parse(entriesData) : []);
                setTags(tagsData ? JSON.parse(tagsData) : []);
            } catch (error: any) {
                console.error('Error loading data:', error);
                if (error.code === 'ERR_FILESYSTEM_CANNOT_FIND_FILE') {
                    setChores([]);
                    setEntries([]);
                    setTags([]);
                } else {
                    console.error('Unhandled error loading files:', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Function to save data back to files
    const saveData = async () => {
        console.log("SaveData chores: ", choresRef.current);  // Access the latest value from the ref
        try {
            await Promise.all([
                FileSystem.writeAsStringAsync(choresFileUri, JSON.stringify(choresRef.current)),
                FileSystem.writeAsStringAsync(entriesFileUri, JSON.stringify(entriesRef.current)),
                FileSystem.writeAsStringAsync(tagsFileUri, JSON.stringify(tagsRef.current)),
            ]);
            console.log('Data saved successfully');

            // Debug: check the file contents after saving
            const savedChores = await FileSystem.readAsStringAsync(choresFileUri);
            console.log('Saved chores content:', savedChores);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Debounced save function to prevent excessive writes
    const debouncedSaveData = useRef(debounce(saveData, 1000)).current;

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
                console.log("Inactive Saving Data");
                debouncedSaveData.flush(); // Immediately save data
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
