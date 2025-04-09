import React, {useEffect, useRef, useState} from 'react';
import { Text, View } from 'react-native';
import {Chore, Tag} from '@/types';
//import { styled } from 'nativewind';
import TagList from "@/components/tags/TagListHorizontal";
import {getPriorityLevelColor, getPriorityLevelLabel, sortTagsByName} from "@/utils/helpers";
import {AntDesign, Entypo, Feather} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {Colors} from "@/constants/Colors";

// Reusable styled components
// const Text = styled(Text);
// const View = styled(View);

interface ChoreCardProps {
    chore: Chore;
    onCompletedPress?: () => void;
    onEditPress?: () => void;
    onDeletePress?: () => void;
    tags: Tag[];
    lastCompleted: string;
    timeLeft: string;
}

// ChoreCard component using reusable Text and View
const ChoreCard: React.FC<ChoreCardProps> = ({ chore, tags, onCompletedPress, onEditPress, onDeletePress, lastCompleted, timeLeft }) => {
    // Determine if the chore is overdue
    const isOverdue = timeLeft.includes('ago');
    const [orderedTags, setOrderedTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (tags){
            setOrderedTags(sortTagsByName(tags));
        }
    }, [tags]);


    const priorityColor = getPriorityLevelColor(chore.priority);
    const priorityLabel = getPriorityLevelLabel(chore.priority) || 'N/A';

    return (
        <View
            className={`bg-medium shadow-md rounded-lg py-4 px-3 mb-3 border-l-4 ${isOverdue ? 'border-red-500' : 'border-secondary'}`}
            accessibilityLabel={`Chore: ${chore.name}`}
        >

            <View className='flex-row justify-between items-center'>
                {/* Last Completed Date and Time */}
                <View className="flex-row items-center flex-1">
                    <AntDesign name="calendar" size={20} color="white" />
                    <Text className={`ml-2 text-secondary`}>{lastCompleted}</Text>
                </View>

                {/* Relative Time */}
                <View className="flex-row items-center flex-1 justify-end">
                    <AntDesign name="clockcircleo" size={20} color="white" />
                    <Text className={`ml-2 text-secondary`}>{timeLeft}</Text>
                </View>

                <View className='ml-4'>
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
                                <View className='flex-row items-center justify-end'>
                                    <Text className={`mr-2 text-lg text-primary`}>Add Entry</Text>
                                    <AntDesign name="calendar" size={20} color="white" />
                                </View>

                            </MenuOption>
                            <MenuOption
                                onSelect={onEditPress}
                                customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                style={{height: 40}}
                            >
                                <View className='flex-row items-center justify-end'>
                                    <Text className={`mr-2 text-lg text-primary`}>Edit Chore</Text>
                                    <AntDesign name="form" size={20} color="white" />
                                </View>

                            </MenuOption>
                            <MenuOption
                                onSelect={onDeletePress}
                                customStyles={{optionText:{color: Colors.textPrimary, textAlign: 'right', fontSize: 18}}}
                                style={{height: 40}}
                            >
                                <View className='flex-row items-center justify-end'>
                                    <Text className={`mr-2 text-lg text-primary`}>Delete Chore</Text>
                                    <AntDesign name="form" size={20} color="white" />
                                </View>

                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-700 my-3" />

            {/* Chore Name */}
            <Text className={`text-lg font-bold text-primary`}>{chore.name}</Text>

            {/* Chore Description */}
            {
                chore.description !== '' &&
                <Text className={`text-sm mt-1 text-secondary`}>{chore.description}</Text>
            }

            {/* Details Container */}
            <View className="flex-row mt-4 justify-between">
                {/* Estimated Time */}
                <View className="flex-1 flex-row">
                    <Ionicons name="timer-outline" size={20} color={Colors.accent} className="mr-2" />
                    <Text className={`pl-1 text-sm text-secondary`}>
                        {`${chore.estTime} ${chore.estTimeType}${chore.estTime > 1 ? 's' : ''}`}
                    </Text>
                </View>

                {/* Frequency */}
                <View className="flex-1 flex-row justify-center">
                    <Feather name="repeat" size={20} color={Colors.accent} className="mr-2" />
                    <Text className={`pl-1 text-sm text-secondary`}>
                        {`${chore.frequency} ${chore.frequencyType}${chore.frequency > 1 ? 's' : ''}`}
                    </Text>
                </View>

                {/* Priority */}
                <View className="flex-1 flex-row justify-end">
                    <Ionicons name="flag" size={20} color={priorityColor} className="mr-2" />
                    <Text className="pl-1 text-sm" style={{color: priorityColor}}>{priorityLabel}</Text>
                </View>
            </View>

            {/* Tags */}
            {orderedTags.length > 0 && <View className='mt-3'>
                <TagList tags={orderedTags}/>
            </View>}
        </View>
    );
};


export default ChoreCard;
