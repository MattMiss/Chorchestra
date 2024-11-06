import dayjs from "@/utils/dayjsConfig";


// input should be date as a string with format 'YYYY-MM-DD'
export const formatDate = (dateKey: string) => {
    return dayjs(dateKey).format('MMM D, YYYY'); // E.g. Oct 7, 2024
}