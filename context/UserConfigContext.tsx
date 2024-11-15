// src/contexts/UserConfigContext.tsx

import React, { createContext, ReactNode, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface NotificationConfig {
    enabled: boolean;
    hour: number;
    minute: number;
}

interface UserConfig {
    theme: 'light' | 'dark';
    language: string;
    choreSortBy: string;
    choreSortOrder: 'asc' | 'desc';
    notification: NotificationConfig;
}

interface UserConfigContextType {
    config: UserConfig;
    isConfigLoading: boolean;
    isConfigError: boolean;
    updateConfig: (newConfig: UserConfig) => void;
    setConfig: (config: UserConfig) => void;
}

// Default configuration
const DEFAULT_CONFIG: UserConfig = {
    theme: 'light',
    language: 'en',
    choreSortBy: 'timeLeft',
    choreSortOrder: 'asc',
    notification: {
        enabled: true,
        hour: 6,
        minute: 0,
    },
};

const CONFIG_KEY = 'userConfig';

const fetchConfig = async (): Promise<UserConfig> => {
    const configData = await AsyncStorage.getItem(CONFIG_KEY);
    if (configData) {
        return JSON.parse(configData);
    } else {
        await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
    }
};

const saveConfigToStorage = async (config: UserConfig): Promise<void> => {
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// Create the context
const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

interface UserConfigProviderProps {
    children: ReactNode;
}

export const UserConfigProvider: React.FC<UserConfigProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: config = DEFAULT_CONFIG, isLoading: isConfigLoading, isError: isConfigError } = useQuery<UserConfig, Error>({
        queryKey: ['userConfig'],
        queryFn: fetchConfig,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const saveConfigMutation = useMutation<void, Error, UserConfig>({
        mutationFn: saveConfigToStorage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userConfig'] });
            console.log('User configuration saved successfully');
        },
        onError: (error: Error) => {
            console.error('Error saving user configuration:', error);
            Alert.alert('Data Error', 'Failed to save user configuration.');
        },
    });

    // Update configuration
    const updateConfig = useCallback(
        (newConfig: UserConfig) => {
            saveConfigMutation.mutate(newConfig);
        },
        [saveConfigMutation]
    );

    // Set the whole configuration (useful for importing data or resetting)
    const setConfig = useCallback(
        (newConfig: UserConfig) => {
            queryClient.setQueryData(['userConfig'], newConfig);
            saveConfigMutation.mutate(newConfig);
        },
        [saveConfigMutation]
    );

    return (
        <UserConfigContext.Provider value={{ config, isConfigLoading, isConfigError, updateConfig, setConfig }}>
            {children}
        </UserConfigContext.Provider>
    );
};

// Custom hook to use the UserConfigContext
export const useUserConfigContext = () => {
    const context = useContext(UserConfigContext);
    if (context === undefined) {
        throw new Error('useUserConfigContext must be used within a UserConfigProvider');
    }
    return context;
};
