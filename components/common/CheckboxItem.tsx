// CheckboxItem.tsx

import React, { memo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import { styled } from 'nativewind';
import { Colors } from "@/constants/Colors";

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ChoreCheckboxItemProps {
    itemId: number;
    itemName: string;
    isSelected: boolean;
    onToggle: (choreId: number) => void;
}

const CheckboxItem: React.FC<ChoreCheckboxItemProps> = memo(({ itemId, itemName, isSelected, onToggle }) => (
    <StyledTouchableOpacity
        onPress={() => onToggle(itemId)}
        className="flex-row items-center mb-2"
    >
        <Checkbox
            value={isSelected}
            onValueChange={() => onToggle(itemId)}
            color={isSelected ? Colors.accent : Colors.textPrimary}
        />
        <StyledText className={`ml-2 text-primary`}>{itemName}</StyledText>
    </StyledTouchableOpacity>
));

export default CheckboxItem;
