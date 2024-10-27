import React, {useEffect, useRef, useState} from 'react';
import { Text, View, Animated } from 'react-native';
import {Chore, Tag} from '@/types';
import { styled } from 'nativewind';
import TagList from "@/components/tags/TagListHorizontal";
import {getPriorityLevelColor, getPriorityLevelLabel, sortTagsByName} from "@/utils/helpers";
import {AntDesign, Entypo, Feather} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {Colors} from "@/constants/Colors";

// Reusable styled components
const StyledText = styled(Text);
const StyledView = styled(View);

interface ChoreCardProps {
    chore: Chore;
    onCompletedPress?: () => void;
    onEditPress?: () => void;
    onDeletePress?: () => void;
    tags: Tag[];
    lastCompleted: string;
    timeLeft: string;
}

// ChoreCard component using reusable StyledText and StyledView
const ChoreCard: React.FC<ChoreCardProps> = ({ chore, tags, onCompletedPress, onEditPress, onDeletePress, lastCompleted, timeLeft }) => {
    // Determine if the chore is overdue
    const isOverdue = timeLeft.includes('ago');
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const [orderedTags, setOrderedTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (tags){
            setOrderedTags(sortTagsByName(tags));
        }
    }, [tags]);

    useEffect(() => {
        if (isOverdue) {
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOverdue]);

    const priorityColor = getPriorityLevelColor(chore.priority);
    const priorityLabel = getPriorityLevelLabel(chore.priority) || 'N/A';

    return (
        <Animated.View
            style={{
                transform: [{ translateX: shakeAnimation }],
            }}
        >
            <StyledView
                className={`bg-medium shadow-md rounded-lg py-4 px-3 mb-3 border-l-4 ${isOverdue ? 'animate-shake border-red-500' : 'border-secondary'}`}
                accessibilityLabel={`Chore: ${chore.name}`}
            >

                <StyledView className='flex-row justify-between items-center'>
                    {/* Last Completed Date and Time */}
                    <StyledView className="flex-row items-center flex-1">
                        <AntDesign name="calendar" size={20} color="white" />
                        <StyledText className={`ml-2 text-secondary`}>{lastCompleted}</StyledText>
                    </StyledView>

                    {/* Relative Time */}
                    <StyledView className="flex-row items-center flex-1 justify-end">
                        <AntDesign name="clockcircleo" size={20} color="white" />
                        <StyledText className={`ml-2 text-secondary`}>{timeLeft}</StyledText>
                    </StyledView>

                    <StyledView className='ml-4'>
                        <Menu>
                            <MenuTrigger>
                                <Entypo name="dots-three-vertical" size={20} color="white"/>
                            </MenuTrigger>

                            <MenuOptions optionsContainerStyle={{backgroundColor: Colors.backgroundPopup, borderRadius: 8, padding: 10, width: 150}}>
                                <MenuOption
                                    onSelect={onCompletedPress}
                                    customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                    style={{height: 40 }}
                                    >
                                    <StyledView className='flex-row items-center justify-end'>
                                        <StyledText className={`mr-2 text-lg text-primary`}>Add Entry</StyledText>
                                        <AntDesign name="calendar" size={20} color="white" />
                                    </StyledView>

                                </MenuOption>
                                <MenuOption
                                    onSelect={onEditPress}
                                    customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                    style={{height: 40}}
                                >
                                    <StyledView className='flex-row items-center justify-end'>
                                        <StyledText className={`mr-2 text-lg text-primary`}>Edit Chore</StyledText>
                                        <AntDesign name="form" size={20} color="white" />
                                    </StyledView>

                                </MenuOption>
                                <MenuOption
                                    onSelect={onDeletePress}
                                    customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                    style={{height: 40}}
                                >
                                    <StyledView className='flex-row items-center justify-end'>
                                        <StyledText className={`mr-2 text-lg text-primary`}>Delete Chore</StyledText>
                                        <AntDesign name="form" size={20} color="white" />
                                    </StyledView>

                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </StyledView>
                </StyledView>

                {/* Divider */}
                <StyledView className="h-px bg-gray-700 my-3" />

                {/* Chore Name */}
                <StyledText className={`text-lg font-bold text-primary`}>{chore.name}</StyledText>

                {/* Chore Description */}
                {
                    chore.description !== '' &&
                    <StyledText className={`text-sm mt-1 text-secondary`}>{chore.description}</StyledText>
                }

                {/* Details Container */}
                <StyledView className="flex-row mt-4 justify-between">
                    {/* Estimated Time */}
                    <StyledView className="flex-1 flex-row">
                        <Ionicons name="timer-outline" size={20} color={Colors.accent} className="mr-2" />
                        <StyledText className={`pl-1 text-sm text-secondary`}>
                            {`${chore.estTime} ${chore.estTimeType}${chore.estTime > 1 ? 's' : ''}`}
                        </StyledText>
                    </StyledView>

                    {/* Frequency */}
                    <StyledView className="flex-1 flex-row justify-center">
                        <Feather name="repeat" size={20} color={Colors.accent} className="mr-2" />
                        <StyledText className={`pl-1 text-sm text-secondary`}>
                            {`${chore.frequency} ${chore.frequencyType}${chore.frequency > 1 ? 's' : ''}`}
                        </StyledText>
                    </StyledView>

                    {/* Priority */}
                    <StyledView className="flex-1 flex-row justify-end">
                        <Ionicons name="flag" size={20} color={priorityColor} className="mr-2" />
                        <StyledText className="pl-1 text-sm" style={{color: priorityColor}}>{priorityLabel}</StyledText>
                    </StyledView>
                </StyledView>

                {/* Tags */}
                {orderedTags.length > 0 && <StyledView className='mt-3'>
                    <TagList tags={orderedTags}/>
                </StyledView>}
            </StyledView>
        </Animated.View>
    );
};


export default ChoreCard;
