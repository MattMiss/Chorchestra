// src/hooks/useProcessedChores.ts

import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useDataContext } from '@/context/DataContext';
import { ProcessedChore } from '@/types';
import { getLastCompletionDate, getNextDueDate, getTimeLeft } from '@/utils/chores';

const useProcessedChores = () => {
    const { chores, entries } = useDataContext();

    const processedChores: ProcessedChore[] = useMemo(() => {
        return chores.map((chore) => {
            const lastCompletionDate = getLastCompletionDate(chore.id, entries);
            const nextDueDate = getNextDueDate(
                lastCompletionDate,
                chore.frequency,
                chore.frequencyType
            );
            const timeLeft = getTimeLeft(nextDueDate);
            const lastCompletedDisplay = lastCompletionDate
                ? lastCompletionDate.format('MMM D, YYYY')
                : 'Never';
            const isOverdue = nextDueDate.isBefore(dayjs(), 'day');

            return {
                ...chore,
                lastCompletedDisplay,
                nextDueDate,
                timeLeft,
                isOverdue,
            };
        });
    }, [chores, entries]);

    return { processedChores };
};

export default useProcessedChores;
