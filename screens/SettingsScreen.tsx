import { Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);

const SettingsScreen = () => {

    return (
        <StyledSafeAreaView className="flex-1 w-100 items-center justify-start">
            <StyledText className="text-3xl font-bold text-center bg-black-400">Add A Note</StyledText>

        </StyledSafeAreaView>
    );
}

export default SettingsScreen;