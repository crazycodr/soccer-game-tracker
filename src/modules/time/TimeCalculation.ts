import type {Event} from "@/stores/models/Event";
import {EventEnum} from "@/stores/models/Event";
import {concat, each, filter, floor, includes, map, sortBy, sum} from "lodash";
import type {Interval} from "date-fns";
import {areIntervalsOverlapping, differenceInMilliseconds} from "date-fns";
import {getEventDate} from "@/modules/time/TimeFormatting";

export function getGameDurationFromGameTimerEvents(events: Event[], now: Date): number {
    const intervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.GAME_TIMER_START,
        [EventEnum.GAME_TIMER_STOP],
        now
    )
    const totalMilliseconds = sum(map(intervals, (interval: Interval) => {
        return differenceInMilliseconds(interval.end, interval.start)
    }))
    return floor(totalMilliseconds / 1000)
}

export function getFieldDurationFromPlayerTimerEvents(events: Event[], now: Date): number {
    const gameTimerIntervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.GAME_TIMER_START,
        [EventEnum.GAME_TIMER_STOP],
        now
    )
    const playerTimerIntervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.PLAYER_TO_FIELD,
        [EventEnum.PLAYER_TO_BENCH],
        now
    )
    let totalMilliseconds = 0
    each(playerTimerIntervals, (gameTimerInterval: Interval) => {
        each(gameTimerIntervals, (playerTimerInterval: Interval) => {
            totalMilliseconds += getOverlappingMilliseconds(gameTimerInterval, playerTimerInterval)
        })
    })
    return floor(totalMilliseconds / 1000)
}

export function getGoalingDurationFromPlayerTimerEvents(events: Event[], now: Date): number {
    const gameTimerIntervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.GAME_TIMER_START,
        [EventEnum.GAME_TIMER_STOP],
        now
    )
    const playerTimerIntervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.PLAYER_TO_GOAL,
        [EventEnum.PLAYER_TO_BENCH],
        now
    )
    let totalMilliseconds = 0
    each(playerTimerIntervals, (gameTimerInterval: Interval) => {
        each(gameTimerIntervals, (playerTimerInterval: Interval) => {
            totalMilliseconds += getOverlappingMilliseconds(gameTimerInterval, playerTimerInterval)
        })
    })
    return floor(totalMilliseconds / 1000)
}

export function getBenchingDurationFromPlayerTimerEvents(events: Event[], now: Date): number {
    const gameTimerIntervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.GAME_TIMER_START,
        [EventEnum.GAME_TIMER_STOP],
        now
    )
    const playerTimerIntervals: Interval[] = createIntervalPairsFrom(
        events,
        EventEnum.PLAYER_TO_BENCH,
        [EventEnum.PLAYER_TO_GOAL, EventEnum.PLAYER_TO_FIELD],
        now
    )
    let totalMilliseconds = 0
    each(playerTimerIntervals, (gameTimerInterval: Interval) => {
        each(gameTimerIntervals, (playerTimerInterval: Interval) => {
            totalMilliseconds += getOverlappingMilliseconds(gameTimerInterval, playerTimerInterval)
        })
    })
    return floor(totalMilliseconds / 1000)
}

export function createIntervalPairsFrom(events: Event[], startType: EventEnum, endTypes: EventEnum[], now: Date): Interval[] {
    const validEvents = filter(events, (event: Event) => {
        return includes(concat([startType], endTypes), event.type)
    })
    const sortedEvents = sortBy(validEvents, 'on')
    let started: boolean = false
    let startsOn: Date | null = null
    const intervals: Interval[] = []
    each(sortedEvents, (event: Event) => {
        if (event.type === startType && !started && !startsOn) {
            started = true
            startsOn = getEventDate(event.on)
        } else if (includes(endTypes, event.type) && started && startsOn && event.on) {
            intervals.push({start: startsOn, end: getEventDate(event.on)})
            started = false
            startsOn = null
        }
    })
    if (started && startsOn) {
        intervals.push({start: startsOn, end: now})
        started = false
        startsOn = null
    }
    return intervals
}

export function getOverlappingMilliseconds(interval1: Interval, interval2: Interval): number {
    // interval don't overlap
    if (!areIntervalsOverlapping(interval1, interval2)) {
        return 0
    }
    // interval 1 intersects interval 2 before it, take start of interval 2 and end of interval 1
    if (interval1.start <= interval2.start && interval1.end <= interval2.end && interval1.end >= interval2.start) {
        return differenceInMilliseconds(interval1.end, interval2.start)
    }
    // interval 1 intersects interval 2 after, take start of interval 1 and end of interval 2
    if (interval1.start >= interval2.start && interval1.end >= interval2.end && interval1.start <= interval2.end) {
        return differenceInMilliseconds(interval2.end, interval1.start)
    }
    // interval 1 overlaps interval 2, take start/end of interval 2
    if (interval1.start <= interval2.start && interval1.end >= interval2.end && interval2.start <= interval1.end) {
        return differenceInMilliseconds(interval2.end, interval2.start)
    }
    // interval 2 overlaps interval 1, take start/end of interval 1
    if (interval1.start >= interval2.start && interval1.end <= interval2.end && interval1.start <= interval2.end) {
        return differenceInMilliseconds(interval1.end, interval1.start)
    }

    return 0
}