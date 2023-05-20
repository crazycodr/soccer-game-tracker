import type {GameEvent} from "@/stores/models/GameEvent";
import {EventEnum} from "@/stores/models/GameEvent";
import {each, filter, floor, includes, sortBy} from "lodash";
import {differenceInMilliseconds} from "date-fns";
import {getEventDate} from "@/modules/time/TimeFormatting";

export function getGameDurationFromGameTimerEvents(events: GameEvent[], now: Date): number {
    const validEvents = filter(events, (event: GameEvent) => {
        return includes([
            EventEnum.GAME_TIMER_START,
            EventEnum.GAME_TIMER_STOP
        ], event.type)
    })
    const sortedEvents = sortBy(validEvents, 'on')
    let timerStarted: boolean = false
    let lastStartTime: Date | null = null
    let accumulator: number = 0
    each(sortedEvents, (event: GameEvent) => {
        if (event.type === EventEnum.GAME_TIMER_START && !timerStarted && !timerStarted) {
            timerStarted = true
            lastStartTime = getEventDate(event.on)
        } else if (event.type === EventEnum.GAME_TIMER_STOP && timerStarted && lastStartTime && event.on) {
            accumulator += differenceInMilliseconds(getEventDate(event.on), lastStartTime)
            lastStartTime = null
            timerStarted = false
        }
    })
    if (timerStarted && lastStartTime) {
        accumulator += differenceInMilliseconds(now, lastStartTime)
        lastStartTime = null
        timerStarted = false
    }
    return floor(accumulator / 1000)
}

export function getFieldDurationFromPlayerTimerEvents(events: GameEvent[], now: Date): number {
    const validEvents = filter(events, (event: GameEvent) => {
        return includes([
            EventEnum.PLAYER_TO_FIELD,
            EventEnum.PLAYER_TO_BENCH,
            EventEnum.PLAYER_TO_GOAL
        ], event.type)
    })
    const sortedEvents = sortBy(validEvents, 'on')
    let timerStarted: boolean = false
    let lastStartTime: Date | null = null
    let accumulator: number = 0
    let goaling: boolean = false
    each(sortedEvents, (event: GameEvent) => {
        if (event.type === EventEnum.PLAYER_TO_FIELD && !timerStarted && !timerStarted) {
            timerStarted = true
            lastStartTime = getEventDate(event.on)
        } else if (event.type === EventEnum.PLAYER_TO_GOAL && !timerStarted && !timerStarted) {
            timerStarted = true
            lastStartTime = getEventDate(event.on)
            goaling = true
        } else if (event.type === EventEnum.PLAYER_TO_BENCH && goaling && timerStarted && lastStartTime && event.on) {
            lastStartTime = null
            timerStarted = false
            goaling = false
        } else if (event.type === EventEnum.PLAYER_TO_BENCH && !goaling && timerStarted && lastStartTime && event.on) {
            accumulator += differenceInMilliseconds(getEventDate(event.on), lastStartTime)
            lastStartTime = null
            timerStarted = false
        }
    })
    if (timerStarted && lastStartTime) {
        accumulator += differenceInMilliseconds(now, lastStartTime)
        lastStartTime = null
        timerStarted = false
    }
    return floor(accumulator / 1000)
}

export function getGoalingDurationFromPlayerTimerEvents(events: GameEvent[], now: Date): number {
    const validEvents = filter(events, (event: GameEvent) => {
        return includes([
            EventEnum.PLAYER_TO_FIELD,
            EventEnum.PLAYER_TO_BENCH,
            EventEnum.PLAYER_TO_GOAL
        ], event.type)
    })
    const sortedEvents = sortBy(validEvents, 'on')
    let timerStarted: boolean = false
    let lastStartTime: Date | null = null
    let accumulator: number = 0
    let goaling: boolean = false
    each(sortedEvents, (event: GameEvent) => {
        if (event.type === EventEnum.PLAYER_TO_FIELD && !timerStarted && !timerStarted) {
            timerStarted = true
            lastStartTime = getEventDate(event.on)
        } else if (event.type === EventEnum.PLAYER_TO_GOAL && !timerStarted && !timerStarted) {
            timerStarted = true
            lastStartTime = getEventDate(event.on)
            goaling = true
        } else if (event.type === EventEnum.PLAYER_TO_BENCH && !goaling && timerStarted && lastStartTime && event.on) {
            lastStartTime = null
            timerStarted = false
            goaling = false
        } else if (event.type === EventEnum.PLAYER_TO_BENCH && goaling && timerStarted && lastStartTime && event.on) {
            accumulator += differenceInMilliseconds(getEventDate(event.on), lastStartTime)
            lastStartTime = null
            timerStarted = false
            goaling = false
        }
    })
    if (timerStarted && lastStartTime) {
        accumulator += differenceInMilliseconds(now, lastStartTime)
        lastStartTime = null
        timerStarted = false
    }
    return floor(accumulator / 1000)
}