import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {StatusBar} from "expo-status-bar";
import {DataProvider} from "@/context/DataContext";

export default function RootLayout() {
  return (
      <DataProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                  <Stack.Screen name="init" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
          </GestureHandlerRootView>
      </DataProvider>
  );
}
