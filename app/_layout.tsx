// RootLayout.tsx
import React, {useEffect} from 'react';
import {Stack, useNavigationContainerRef} from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeWindStyleSheet } from "nativewind";
import { MenuProvider } from 'react-native-popup-menu';
import * as Sentry from '@sentry/react-native';
import {isRunningInExpoGo} from "expo";
import { ChoresProvider } from '@/context/ChoresContext';
import {EntriesProvider} from "@/context/EntriesContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {TagsProvider} from "@/context/TagsContext";
import NotificationManager from "@/components/notifications/NotificationManager";

NativeWindStyleSheet.setOutput({
    default: "native",
});

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
    dsn: 'https://a7fb880fe07737461e4589957315f00d@o4508170779623424.ingest.us.sentry.io/4508170784735232',
    debug: true, // Set to `false` in production
    // Additional configurations if needed
    integrations: [
        new Sentry.ReactNativeTracing({
            routingInstrumentation,
            enableNativeFramesTracking: !isRunningInExpoGo(),
        })
    ]
});

function RootLayout() {
    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref){
            routingInstrumentation.registerNavigationContainer(ref);
        }
    }, [ref]);

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ChoresProvider>
                <EntriesProvider>
                    <TagsProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <MenuProvider>
                                <Stack screenOptions={{headerShown: false}}>
                                    <Stack.Screen name="init" options={{ headerShown: false }} />
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                </Stack>
                            </MenuProvider>
                            <NotificationManager />
                        </GestureHandlerRootView>
                    </TagsProvider>
                </EntriesProvider>
            </ChoresProvider>
        </QueryClientProvider>
    );
}

export default Sentry.wrap(RootLayout);