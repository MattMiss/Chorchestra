// src/utils/chores.ts

import { Dayjs } from "dayjs";
import dayjs from '@/utils/dayjsConfig'; // Import from dayjsConfig to ensure plugins are included
import { FrequencyType, ProcessedChore, Section } from '@/types';

// Get the last completion date for a chore
export const getLastCompletionDate = (
    choreId: number,
    entries: { choreId: number; dateCompleted: string }[]
): Dayjs | null => {
    const choreEntries = entries
        .filter(entry => entry.choreId === choreId)
        .map(entry => dayjs(entry.dateCompleted)) // Use configured dayjs here
        .sort((a, b) => b.valueOf() - a.valueOf());

    return choreEntries.length > 0 ? choreEntries[0] : null;
};

// Calculates the next due date for a chore
export const getNextDueDate = (
    lastDate: Dayjs | null,
    frequency: number,
    frequencyType: FrequencyType
): Dayjs => {
    return lastDate ? lastDate.add(frequency, frequencyType) : dayjs(); // Use dayjs to get current date if no lastDate
};

// Get the time left until the next due date
export const getTimeLeft = (nextDueDate: Dayjs): string => {
    const now = dayjs(); // Current date with dayjs configuration

    if (!nextDueDate || nextDueDate.isToday()) {
        return 'Due Today';
    }
    return nextDueDate.isAfter(now) ? nextDueDate.fromNow() : nextDueDate.fromNow(); // fromNow handles past and future dates
};

// Categorize processed chores by due dates
export const categorizeProcessedChores = (processedChores: ProcessedChore[]) => {
    const pastDue: ProcessedChore[] = [];
    const dueToday: ProcessedChore[] = [];
    const dueThisWeek: ProcessedChore[] = [];

    const today = dayjs().startOf('day'); // Start of today

    processedChores.forEach((chore) => {
        const dueDate = chore.nextDueDate.startOf('day'); // Normalize to start of the day
        const daysLeft = dueDate.diff(today, 'day'); // Calculate days left

        if (daysLeft < 0) {
            pastDue.push(chore);
        } else if (daysLeft === 0) {
            dueToday.push(chore);
        } else if (daysLeft <= 7) { // 7-day inclusive window
            dueThisWeek.push(chore);
        }
    });

    const sortByName = (a: ProcessedChore, b: ProcessedChore) => a.name.localeCompare(b.name);
    pastDue.sort(sortByName);
    dueToday.sort(sortByName);
    dueThisWeek.sort(sortByName);

    return { pastDue, dueToday, dueThisWeek };
};

// Group chores by time left
export const groupChoresByTimeLeft = (chores: ProcessedChore[]): Section[] => {
    const sections: Section[] = [
        { title: 'Overdue', data: [] },
        { title: 'Due Today', data: [] },
        { title: 'In a Week', data: [] },
        { title: 'In a Month', data: [] },
        { title: 'More Than a Month', data: [] },
    ];

    const normalizedToday = dayjs().startOf('day');

    chores.forEach((chore) => {
        const dueDate = dayjs(chore.nextDueDate).startOf('day');
        const daysLeft = dueDate.diff(normalizedToday, 'day');

        if (chore.isOverdue) {
            sections[0].data.push(chore);
        } else if (daysLeft === 0) {
            sections[1].data.push(chore);
        } else if (daysLeft <= 7) {
            sections[2].data.push(chore);
        } else if (daysLeft <= 30) {
            sections[3].data.push(chore);
        } else {
            sections[4].data.push(chore);
        }
    });

    return sections.filter(section => section.data.length > 0);
};

// Group chores by priority
export const groupChoresByPriority = (chores: ProcessedChore[]): Section[] => {
    const prioritySections: Section[] = [
        { title: 'High Priority', data: [] },
        { title: 'Medium Priority', data: [] },
        { title: 'Low Priority', data: [] },
    ];

    chores.forEach((chore) => {
        switch (chore.priority) {
            case 3:
                prioritySections[0].data.push(chore);
                break;
            case 2:
                prioritySections[1].data.push(chore);
                break;
            case 1:
                prioritySections[2].data.push(chore);
                break;
            default:
                break;
        }
    });

    return prioritySections.filter(section => section.data.length > 0);
};

// Group chores based on grouping criteria
export const groupChores = (chores: ProcessedChore[], groupBy: string): Section[] => {
    if (groupBy === 'timeLeft') return groupChoresByTimeLeft(chores);
    if (groupBy === 'priority') return groupChoresByPriority(chores);
    return [{ title: 'Chores', data: chores }];
};
