// src/components/SpecificSectionList.tsx

import React, {ReactNode} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Container from '@/components/common/Container';
import { ProcessedChore } from '@/types';
import {styled} from "nativewind";
import {AntDesign} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface SpecificSectionListProps {
    sectionTitle: string;
    chores: ProcessedChore[];
    icon?: ReactNode;
    onPress: () => void;
}

const ChoreSectionList = ({ sectionTitle, chores, icon, onPress }: SpecificSectionListProps) => {

    return (
        <Container>
            <StyledTouchableOpacity onPress={onPress}>
                <StyledView className="flex-row">
                    <StyledView className="mt-[2]">
                        {icon || <AntDesign name="warning" size={24} color={Colors.textPrimary}/>}
                    </StyledView>
                    <StyledView>
                        <StyledText className="ml-2 font-bold text-lg text-accent">{sectionTitle}:</StyledText>
                        <StyledView className="ml-2 mt-2">
                            {chores.length > 0 ? (
                                chores.map(chore => <StyledText className="text-primary" key={chore.id}>{chore.name}</StyledText>)
                            ) : (
                                <StyledText className="text-primary">No chores</StyledText>
                            )}
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledTouchableOpacity>
        </Container>
    );
};

export default ChoreSectionList;
