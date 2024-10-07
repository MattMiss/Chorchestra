import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {DataProvider} from "@/context/DataContext";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
    default: "native",
});

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
