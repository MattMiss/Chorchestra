// src/contexts/TagsContext.tsx

import React, { createContext, ReactNode, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Tag} from '@/types';
import { Alert } from 'react-native';

interface TagsContextType {
    tags: Tag[];
    isTagsLoading: boolean;
    isTagsError: boolean;
    addTag: (newTag: Tag) => void;
    editTag: (updatedTag: Tag) => void;
    deleteTag: (tagId: number) => void;
    setTags: (tags: Tag[]) => void;
}

// Create the context
const TagsContext = createContext<TagsContextType | undefined>(undefined);

interface TagsProviderProps {
    children: ReactNode;
}

const TAGS_KEY = 'tags';

const validateTag = (tag: any): tag is Tag =>
    typeof tag.id === 'number' && typeof tag.name === 'string';

const fetchTags = async (): Promise<Tag[]> => {
    const tagsData = await AsyncStorage.getItem(TAGS_KEY);
    const parsedTags = tagsData ? JSON.parse(tagsData) : [];
    if (Array.isArray(parsedTags) && parsedTags.every(validateTag)) {
        return parsedTags;
    } else {
        throw new Error('Invalid tags data');
    }
};

const saveTagsToStorage = async (tags: Tag[]): Promise<void> => {
    await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};

export const TagsProvider: React.FC<TagsProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: tags = [], isLoading: isTagsLoading, isError: isTagsError } = useQuery<Tag[], Error>({
        queryKey: ['tags'],
        queryFn: fetchTags,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    // Mutation for saving tags
    const saveTagsMutation = useMutation<void, Error, Tag[]>({
        mutationFn: saveTagsToStorage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            console.log('Tags saved successfully');
        },
        onError: (error: Error) => {
            console.error('Error saving tags:', error);
            Alert.alert('Data Error', 'Failed to save tags data.');
        },
    });

    // Add a new tag
    const addTag = useCallback(
        (newTag: Tag) => {
            if (!tags) return;

            const updatedTags = [...tags, newTag];
            saveTagsMutation.mutate(updatedTags);
        },
        [tags, saveTagsMutation]
    );

    // Edit an existing tag
    const editTag = useCallback(
        (updatedTag: Tag) => {
            if (!tags) return;

            const updatedTags = tags.map(tag =>
                tag.id === updatedTag.id ? updatedTag : tag
            );
            saveTagsMutation.mutate(updatedTags);
        },
        [tags, saveTagsMutation]
    );

    // Delete a tag
    const deleteTag = useCallback(
        (tagId: number) => {
            if (!tags) return;

            const updatedTags = tags.filter(tag => tag.id !== tagId);
            saveTagsMutation.mutate(updatedTags);
        },
        [tags, saveTagsMutation]
    );

    // Set all tags (e.g., for importing data)
    const setTags = useCallback(
        (newTags: Tag[]) => {
            queryClient.setQueryData(['tags'], newTags);
            saveTagsMutation.mutate(newTags);
        },
        [saveTagsMutation]
    );

    return (
        <TagsContext.Provider value={{ tags, isTagsLoading, isTagsError, addTag, editTag, deleteTag, setTags }}>
            {children}
        </TagsContext.Provider>
    );
};

export const useTagsContext = () => {
    const context = useContext(TagsContext);
    if (context === undefined) {
        throw new Error('useTagsContext must be used within a TagsProvider');
    }
    return context;
};
