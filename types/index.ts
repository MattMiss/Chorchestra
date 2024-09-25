// types/index.ts

export interface Tag {
    id: number;
    title: string;
}

export interface DraggableListItem {
    id: string;
    text: string;
}

export type FrequencyType = 'day' | 'week' | 'month' | 'year';

export const frequencyOptions: FrequencyType[] = ['day', 'week', 'month', 'year'];

export type PriorityLevel = 1 | 2 | 3;

export const priorityOptions = [
    { label: 'High', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'Low', value: 1 },
];

export interface Chore {
    id: number;
    name: string;
    description: string;
    instructions: string[];
    items_needed: string[];
    status: string;
    frequency: number;
    frequency_type: FrequencyType;
    importance: number;
}
