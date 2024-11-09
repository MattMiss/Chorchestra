// src/components/notifications/NotificationManager.tsx

import {useEffect, useRef} from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import useCategorizedChores from '@/hooks/useCategorizedChores'; // Import your custom hook

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

    // Track if the notification has already been scheduled
    const notificationScheduled = useRef(false);

    const calculateChoreCountsForTomorrow = () => {
        // pastDue and dueToday is actually tomorrow's "pastDue" and "dueToday" because notification is
        // scheduled for tomorrow but calculated today
        let pastDueCount = 0; // chores past due + due today
        let dueTodayCount = 0; // chores due tomorrow

        const today = dayjs();
        const tomorrow = today.add(1, 'day');

        sections.forEach(section => {
            // Add today's past due and due today chores to tomorrow's "past due" count
            if (section.title === 'Past Due' || section.title === 'Due Today') {
                pastDueCount += section.data.length;
            } else if (section.title === 'Due This Week') {
                // Check if any chores are due specifically tomorrow
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
            body += '!'

            // Schedule the notification at 6 AM daily
            const trigger = {
                hour: 18,
                minute: 34,
                repeats: true,
            };

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Daily Chore Reminder',
                    body: body,
                    data: { type: 'daily_reminder' },
                },
                trigger: trigger,
            });

            console.log('Daily notification scheduled at 6 AM.');
        } catch (error) {
            console.error('Error scheduling notification:', error);
            //Alert.alert('Error', 'Failed to schedule daily notification.');
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
                    importance: Notifications.AndroidImportance.DEFAULT,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            // Schedule the daily notification
            await scheduleDailyNotification();
        };

        requestPermissionsAndSchedule();
    }, []);

    // Reschedule notification whenever the chores sections change
    useEffect(() => {
        if (!notificationScheduled.current) {
            scheduleDailyNotification();
            notificationScheduled.current = true; // Set the flag to prevent duplicate notifications
        }

        // Reset the flag if necessary (e.g., when the component unmounts)
        return () => {
            notificationScheduled.current = false;
        };
    }, [sections]);

    return null; // This component does not render anything
};

export default NotificationManager;
