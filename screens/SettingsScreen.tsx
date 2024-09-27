import { Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import ThemedScreen from "@/components/common/ThemedScreen";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);

const SettingsScreen = () => {

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={true}
            headerTitle={'Settings'}
        >
            <StyledSafeAreaView className="flex-1 items-center">


            </StyledSafeAreaView>
        </ThemedScreen>
    );
}

export default SettingsScreen;