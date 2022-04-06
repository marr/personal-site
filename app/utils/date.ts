import { compareAsc, compareDesc, format, formatDistanceToNow, isThisYear, isToday } from 'date-fns';

export const byDate = (desc = true) => desc ? compareDesc : compareAsc;

export const formatDateTime = (date: Date) => {
    if (isToday(date)) {
        return formatDistanceToNow(date, { addSuffix: true })
    }
    let formatStr = 'MMM dd'; 
    if (!isThisYear(date)) {
        formatStr += ', yyyy';
    }
    return format(date, formatStr);
}