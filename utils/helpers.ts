// src/utils/helpers.ts

import {PriorityLevel, priorityOptions, Tag, Chore, FrequencyType, ProcessedChore, Section} from "@/types";
import { Dayjs } from 'dayjs';
import dayjs from '@/utils/dayjsConfig'

// Function to get a tag by its ID
export const getTagById = (tags: Tag[], id: number): Tag | undefined => {
    return tags.find((tag) => tag.id === id);
};

// Function to get an array of tag IDs from a tag list
export const getTagIdsFromTags = (tags: Tag[]): number[] => {
    return tags.map((tag) => tag.id);
};

// Function to get a chore by its ID
export const getChoreById = (chores: Chore[], id: number): Chore | undefined => {
    return chores.find((chore) => chore.id === id);
};

// Function to get a chore name by its ID
export const getChoreNameById = (chores: Chore[], id: number): string | undefined => {
    return chores.find((chore) => chore.id === id)?.name;
};

export const getPriorityLevelColor = (pLevel: PriorityLevel): string => {
    const color = priorityOptions.find(p => p.value === pLevel)?.color;
    return color || '#7a7a7a';
}

export const getPriorityLevelLabel = (pLevel: PriorityLevel): string | undefined => {
    return priorityOptions.find(p => p.value === pLevel)?.label;
}

/**
 * Sorts an array of tags by their name property.
 *
 * @param tags - The array of tags to sort.
 * @param options - Optional sorting options.
 * @returns A new array of tags sorted by name.
 */
export const sortTagsByName = (
    tags: Tag[],
    options?: {
        ascending?: boolean;
        caseSensitive?: boolean;
    }
): Tag[] => {
    const { ascending = true, caseSensitive = false } = options || {};

    return [...tags].sort((a, b) => {
        let nameA = a.name;
        let nameB = b.name;

        if (!caseSensitive) {
            nameA = nameA.toLowerCase();
            nameB = nameB.toLowerCase();
        }

        if (nameA < nameB) return ascending ? -1 : 1;
        if (nameA > nameB) return ascending ? 1 : -1;
        return 0; // names are equal
    });
};

// src/utils/colorUtils.ts

/**
 * Converts a HEX color string to its RGB components.
 * @param hex - The HEX color string (e.g., '#FF5733').
 * @returns An object containing the red, green, and blue components.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    // Remove '#' if present
    const cleanedHex = hex.replace('#', '');

    // Handle short HEX colors (e.g., '#FFF')
    const fullHex = cleanedHex.length === 3
        ? cleanedHex.split('').map(char => char + char).join('')
        : cleanedHex;

    if (fullHex.length !== 6) {
        return null; // Invalid HEX color
    }

    const bigint = parseInt(fullHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};

/**
 * Determines whether to use black or white text based on the background color.
 * @param backgroundColor - The background color in HEX format (e.g., '#FF5733').
 * @returns A string representing the text color: 'black' or 'white'.
 */
export const getContrastingTextColor = (backgroundColor: string): 'black' | 'white' => {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) {
        // Default to black if the color is invalid
        return 'black';
    }

    const { r, g, b } = rgb;

    // Calculate YIQ value
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? 'black' : 'white';
};

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

