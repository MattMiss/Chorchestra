// src/components/notifications/NotificationManager.tsx

import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import useCategorizedChores from '@/hooks/useCategorizedChores';
import { NotificationTriggerInput, SchedulableTriggerInputTypes } from "expo-notifications";
import { useUserConfigContext } from "@/context/UserConfigContext";

// Configure how notifications are handled when received while the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const NotificationManager = () => {
    const { sections } = useCategorizedChores();
    const { config } = useUserConfigContext();

    // Track if the notification has already been scheduled
    const notificationScheduled = useRef(false);

    const calculateChoreCountsForTomorrow = () => {
        let pastDueCount = 0;
        let dueTodayCount = 0;

        const today = dayjs();
        const tomorrow = today.add(1, 'day');

        sections.forEach(section => {
            if (section.title === 'Past Due' || section.title === 'Due Today') {
                pastDueCount += section.data.length;
            } else if (section.title === 'Due This Week') {
                section.data.forEach(chore => {
                    if (dayjs(chore.nextDueDate).isSame(tomorrow, 'day')) {
                        dueTodayCount += 1;
                    }
                });
            }
        });

        return { pastDueCount, dueTodayCount };
    };

    // Function to schedule the daily notification
    const scheduleDailyNotification = async () => {
        console.log("Scheduling daily notification...");
        try {
            // Ensure config exists and notifications are enabled
            if (!config || !config.notification.enabled) {
                console.log('Notifications are disabled or config is not loaded.');
                return;
            }

            // Cancel all existing scheduled notifications to prevent duplicates
            await Notifications.cancelAllScheduledNotificationsAsync();

            const { pastDueCount, dueTodayCount } = calculateChoreCountsForTomorrow();

            // Only schedule if there are chores to notify
            if (pastDueCount === 0 && dueTodayCount === 0) {
                console.log('No chores to notify, skipping notification scheduling.');
                return;
            }

            // Compose the notification body based on counts
            let body = '';
            if (dueTodayCount > 0) {
                body += `You have ${dueTodayCount} chore${dueTodayCount > 1 ? 's' : ''} due today`;
            }
            if (pastDueCount > 0) {
                body += `${dueTodayCount > 0 ? ' and' : 'You have'} ${pastDueCount} past due chore${pastDueCount > 1 ? 's' : ''}`;
            }
            body += '!';

            // Schedule the notification at the configured time
            const trigger: NotificationTriggerInput = {
                hour: config.notification.hour,
                minute: config.notification.minute,
                type: SchedulableTriggerInputTypes.DAILY,
            };

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Daily Chore Reminder',
                    body: body,
                    data: { type: 'daily_reminder' },
                },
                trigger: trigger,
            });

            console.log(`Daily notification scheduled at ${config.notification.hour}:${config.notification.minute}.`);
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    // Request notification permissions and schedule the initial notification
    useEffect(() => {
        const requestPermissionsAndSchedule = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Failed to get push token for push notifications!'
                );
                return;
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            // Schedule the daily notification
            await scheduleDailyNotification();
        };

        requestPermissionsAndSchedule();
    }, [config]);

    // Reschedule notification whenever the chores sections change
    useEffect(() => {
        if (!notificationScheduled.current && config && config.notification.enabled) {
            scheduleDailyNotification();
            notificationScheduled.current = true; // Set the flag to prevent duplicate notifications
        }

        // Reset the flag if necessary (e.g., when the component unmounts)
        return () => {
            notificationScheduled.current = false;
        };
    }, [sections, config]);

    return null; // This component does not render anything
};

export default NotificationManager;
