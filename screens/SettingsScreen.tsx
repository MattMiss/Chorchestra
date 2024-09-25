import { Text, TouchableOpacity, View} from 'react-native';
import {styled} from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddNoteScreen = () => {

    return (
        <StyledView className="flex-1 w-100 items-center justify-center">
            <StyledText className="text-3xl font-bold text-center bg-black-400">Add A Note</StyledText>

        </StyledView>
    );
}

export default AddNoteScreen;