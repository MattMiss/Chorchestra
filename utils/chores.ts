// src/utils/chores.ts
import dayjs, {Dayjs} from "dayjs";
import {FrequencyType, ProcessedChore, Section} from '@/types';


// Get the last completion date for a chore
export const getLastCompletionDate = (
    choreId: number,
    entries: { choreId: number; dateCompleted: string }[]
): Dayjs | null => {
    const choreEntries = entries
        .filter(entry => entry.choreId === choreId)
        .map(entry => dayjs(entry.dateCompleted))
        .sort((a, b) => b.valueOf() - a.valueOf());

    return choreEntries.length > 0 ? choreEntries[0] : null;
};

/**
 * Calculates the next due date for a chore based on the last completion date, frequency, and frequency type.
 *
 * @param lastDate - The last completion date of the chore.
 * @param frequency - How often the chore should be completed.
 * @param frequencyType - The unit of frequency ('day', 'week', 'month', 'year').
 * @returns The next due date as a Dayjs object.
 */
export const getNextDueDate = (
    lastDate: Dayjs | null,
    frequency: number,
    frequencyType: FrequencyType
): Dayjs => {
    if (lastDate) {
        return lastDate.add(frequency, frequencyType);
    }
    // If never completed, set due date as now
    return dayjs();
};

// Get the time left until the next due date
export const getTimeLeft = (nextDueDate: Dayjs): string => {
    const now = dayjs();

    // Check if the next due date is today
    if (nextDueDate.isToday()) {
        return 'Due Today';
    }

    // If the due date is in the future, return the time left
    if (nextDueDate.isAfter(now)) {
        return nextDueDate.fromNow(); // e.g., 'in 3 days', 'in a week'
    }

    // If the due date is in the past (but the day has already changed), return the relative time
    return nextDueDate.fromNow(); // e.g., 'a day ago', '2 days ago'
};

// Function to categorize processed chores
export const categorizeProcessedChores = (processedChores: ProcessedChore[]) => {
    const pastDue: ProcessedChore[] = [];
    const dueToday: ProcessedChore[] = [];
    const dueThisWeek: ProcessedChore[] = [];

    const today = dayjs();
    const endOfWeek = today.endOf('week');

    processedChores.forEach((chore) => {
        if (chore.nextDueDate.isBefore(today, 'day')) {
            pastDue.push(chore);
        } else if (chore.nextDueDate.isSame(today, 'day')) {
            dueToday.push(chore);
        } else if (
            chore.nextDueDate.isAfter(today, 'day') &&
            chore.nextDueDate.isBefore(endOfWeek, 'day')
        ) {
            dueThisWeek.push(chore);
        }
    });

    // Sort each category by chore name
    const sortByName = (a: ProcessedChore, b: ProcessedChore) => a.name.localeCompare(b.name);
    pastDue.sort(sortByName);
    dueToday.sort(sortByName);
    dueThisWeek.sort(sortByName);

    return {
        pastDue,
        dueToday,
        dueThisWeek,
    };
};

/**
 * Groups chores into sections based on their time left.
 * @param chores Array of processed chores.
 * @returns Array of sections.
 */
export const groupChoresByTimeLeft = (chores: ProcessedChore[]): Section[] => {
    const sections: Section[] = [
        { title: 'Overdue', data: [] },
        { title: 'Due Today', data: [] },
        { title: 'In a Week', data: [] },
        { title: 'In a Month', data: [] },
        { title: 'More Than a Month', data: [] },
    ];

    chores.forEach((chore) => {
        const daysLeft = chore.nextDueDate.diff(dayjs(), 'day');

        if (chore.isOverdue) {
            sections[0].data.push(chore);
        } else if (daysLeft === 0) {
            sections[1].data.push(chore);
        } else if (daysLeft > 0 && daysLeft <= 7) {
            sections[2].data.push(chore);
        } else if (daysLeft > 7 && daysLeft <= 30) {
            sections[3].data.push(chore);
        } else {
            sections[4].data.push(chore);
        }
    });

    // Remove empty sections
    return sections.filter(section => section.data.length > 0);
};

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

    // Remove empty sections
    return prioritySections.filter(section => section.data.length > 0);
};


export const groupChores = (chores: ProcessedChore[], groupBy: string): Section[] => {
    if (groupBy === 'timeLeft') {
        return groupChoresByTimeLeft(chores);
    }

    if (groupBy === 'priority') {
        return groupChoresByPriority(chores);
    }

    // Default to no grouping if groupBy value is unrecognized
    return [{ title: 'Chores', data: chores }];
};
