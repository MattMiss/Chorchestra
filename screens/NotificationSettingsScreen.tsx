// src/screens/NotificationSettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, Switch, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useUserConfigContext } from '@/context/UserConfigContext';
import ThemedScreen from "@/components/common/ThemedScreen";
//import { styled } from "nativewind";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

const NotificationSettingsScreen = () => {
    const { config, updateConfig } = useUserConfigContext();

    // Local state to control the toggle and time selection
    const [notificationsEnabled, setNotificationsEnabled] = useState(config.notification.enabled);

    // Initialize selectedTime as a Date object directly
    const initialTime = new Date();
    initialTime.setHours(config.notification.hour, config.notification.minute, 0, 0);
    const [selectedTime, setSelectedTime] = useState(initialTime);

    const [showTimePicker, setShowTimePicker] = useState(false);

    // Format selectedTime using Day.js
    const formatTime = (time: Date) => dayjs(time).format('h:mm A');

    // Toggle notifications
    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
        updateConfig({
            ...config,
            notification: {
                ...config.notification,
                enabled: !notificationsEnabled,
            },
        });
    };

    // Handle time change from DateTimePicker
    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            const hour = selectedDate.getHours();
            const minute = selectedDate.getMinutes();
            setSelectedTime(selectedDate); // Update with the new selected Date object
            updateConfig({
                ...config,
                notification: {
                    ...config.notification,
                    hour,
                    minute,
                },
            });
            Alert.alert(
                'Notification Time Updated',
                `New time set to ${formatTime(selectedDate)}`
            );
        }
        setShowTimePicker(false);
    };

    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={false}
            headerTitle={'Notification Settings'}
        >
            <View className="flex-1 p-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-primary text-lg">
                        Notifications Enabled
                    </Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={handleToggleNotifications}
                    />
                </View>

                {notificationsEnabled && <View className="flex-row justify-between items-center mb-4">
                    <Text className="flex-1 text-primary text-lg">Re-occurring Time</Text>
                    <TouchableOpacity
                        className=""
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Text className="text-xl text-primary">
                            {formatTime(selectedTime)}
                        </Text>
                    </TouchableOpacity>
                </View>}

                {showTimePicker && (
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        is24Hour={false} // Display in 12-hour format
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}
            </View>
        </ThemedScreen>
    );
};

export default NotificationSettingsScreen;
