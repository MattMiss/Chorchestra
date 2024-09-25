import { Stack } from "expo-router";
import {StatusBar} from "expo-status-bar";
import {styled} from "nativewind";

const StyledStatusBar = styled(StatusBar);

export default function InitLayout() {
    return (
        <>
            <StyledStatusBar backgroundColor='#000000'/>
            <Stack>
                <Stack.Screen name="init" options={{ headerShown: false }} />
            </Stack>
        </>

    );
}
