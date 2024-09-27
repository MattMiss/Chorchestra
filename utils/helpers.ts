import {PriorityLevel, priorityOptions, Tag} from "@/types";

// Function to get a tag by its ID
export const getTagById = (tags: Tag[], id: number): Tag | undefined => {
    return tags.find((tag) => tag.id === id);
};

// Function to get an array of tag IDs from a tag list
export const getTagIdsFromTags = (tags: Tag[]): number[] => {
    return tags.map((tag) => tag.id);
};

export const getPriorityLevelColor = (pLevel: PriorityLevel): string => {
    const color = priorityOptions.find(p => {return p.value === pLevel})?.color;
    return color || '#7a7a7a';
}

export const getPriorityLevelLabel = (pLevel: PriorityLevel): string | undefined => {
    return priorityOptions.find(p => {return p.value === pLevel})?.label;
}