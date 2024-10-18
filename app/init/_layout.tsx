import { Stack } from "expo-router";
import { View } from 'react-native';
import { styled } from 'nativewind';

// Styled component for your root View
const StyledView = styled(View);

export default function InitLayout() {
    return (
        <StyledView className="flex-1 bg-dark">
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </StyledView>
    );
}
