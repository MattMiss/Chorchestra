// ChoreCheckboxItem.tsx

import React, { memo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import { styled } from 'nativewind';
import { Colors } from "@/constants/Colors";

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ChoreCheckboxItemProps {
    choreId: number;
    choreName: string;
    isSelected: boolean;
    onToggle: (choreId: number) => void;
}

const ChoreCheckboxItem: React.FC<ChoreCheckboxItemProps> = memo(({ choreId, choreName, isSelected, onToggle }) => (
    <StyledTouchableOpacity
        onPress={() => onToggle(choreId)}
        className="flex-row items-center mb-2"
    >
        <Checkbox
            value={isSelected}
            onValueChange={() => onToggle(choreId)}
            color={isSelected ? Colors.accent : Colors.textPrimary}
        />
        <StyledText className={`ml-2 text-primary`}>{choreName}</StyledText>
    </StyledTouchableOpacity>
));

export default ChoreCheckboxItem;
