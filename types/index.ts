// types/index.ts

export type FrequencyType = 'day' | 'week' | 'month' | 'year';

export const frequencyOptions: FrequencyType[] = ['day', 'week', 'month', 'year'];

export type PriorityLevel = 1 | 2 | 3;

export const priorityOptions = [
    { label: 'High', value: 3, color: '#a42b2b' },
    { label: 'Medium', value: 2, color: '#b7b72d' },
    { label: 'Low', value: 1, color: '#26c526' },
];

export interface Tag {
    id: number;
    name: string;
    color?: string;
}

export interface Chore {
    id: number;
    name: string;
    description: string;
    frequency: number;
    frequencyType: FrequencyType;
    status: string;
    priority: PriorityLevel;
    instructions: string[];
    itemsNeeded: string[];
    tagIds: number[];
}

export interface Entry {
    id: number;
    choreId: number;
    dateCompleted: string; // ISO date string
}

export interface DraggableListItem {
    id: string;
    text: string;
}
