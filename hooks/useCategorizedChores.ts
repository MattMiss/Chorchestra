// src/hooks/useCategorizedChores.ts

import { useMemo } from 'react';

import { categorizeProcessedChores } from '@/utils/chores';
import { Section } from '@/types';
import useProcessedChores from "@/hooks/useProcessedChores";

const useCategorizedChores = () => {
    const { processedChores } = useProcessedChores();

    const categorized = useMemo(() => categorizeProcessedChores(processedChores), [processedChores]);

    const sections: Section[] = useMemo(() => {
        const sections: Section[] = [];

        if (categorized.pastDue.length > 0) {
            sections.push({ title: 'Past Due', data: categorized.pastDue });
        }
        if (categorized.dueToday.length > 0) {
            sections.push({ title: 'Due Today', data: categorized.dueToday });
        }
        if (categorized.dueThisWeek.length > 0) {
            sections.push({ title: 'Due This Week', data: categorized.dueThisWeek });
        }


        return sections;
    }, [categorized]);

    return { sections };
};

export default useCategorizedChores;
