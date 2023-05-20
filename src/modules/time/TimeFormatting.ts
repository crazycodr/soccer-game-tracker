import {isString} from "lodash";
import {parseISO} from "date-fns";

export function formatTimeFromSeconds(totalSeconds: number): string {
    const seconds = Math.floor(totalSeconds % 60).toFixed(0).toString().padStart(2, '0')
    const minutes = Math.floor(totalSeconds / 60).toFixed(0).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}

export function getEventDate(value: Date | string | null): Date {
    if (value instanceof Date) {
        return value
    }
    if (isString(value)) {
        return parseISO(value)
    }
    return new Date()
}