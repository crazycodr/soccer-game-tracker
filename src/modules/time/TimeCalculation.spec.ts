import {describe, expect, test} from "vitest";
import {
    createIntervalPairsFrom, getBenchingDurationFromPlayerTimerEvents,
    getFieldDurationFromPlayerTimerEvents,
    getGameDurationFromGameTimerEvents,
    getGoalingDurationFromPlayerTimerEvents, getOverlappingMilliseconds
} from "@/modules/time/TimeCalculation";
import {EventEnum, Event} from "@/stores/models/Event";
import {addSeconds} from "date-fns";

const now = new Date()
const gameStart0m = new Event(EventEnum.GAME_TIMER_START, addSeconds(now, 0), null, null)
const gameEnd90m = new Event(EventEnum.GAME_TIMER_STOP, addSeconds(now, 90 * 60), null, null)

describe('time calculation tests', () => {

    describe('getGameDurationFromGameTimerEvents', () => {
        test('start only (missing end) returns diff between start and now provided in 2nd parameter', () => {
            const startAt = addSeconds(now, 0)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, now, null, null)
            expect(getGameDurationFromGameTimerEvents([startEvent], startAt)).toBe(0)
        })
        test('start + end returns diff between start + end', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, stopAt, null, null)
            expect(getGameDurationFromGameTimerEvents([startEvent, endEvent], now)).toBe(17)
        })
        test('start + end + start + end returns diff between spans omitting space between stop and start', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, stopAt, null, null)
            const restartEvent = new Event(EventEnum.GAME_TIMER_START, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.GAME_TIMER_STOP, reStopAt, null, null)
            expect(getGameDurationFromGameTimerEvents([startEvent, endEvent, restartEvent, reStopEvent], now)).toBe(29)
        })
        test('Items should be sorted and calculated properly', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, stopAt, null, null)
            const restartEvent = new Event(EventEnum.GAME_TIMER_START, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.GAME_TIMER_STOP, reStopAt, null, null)
            expect(getGameDurationFromGameTimerEvents([endEvent, restartEvent, startEvent, reStopEvent], now)).toBe(29)
        })
        test('Items should be presented in START/STOP order and thus will yield a different result', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.GAME_TIMER_STOP, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_START, stopAt, null, null)
            const restartEvent = new Event(EventEnum.GAME_TIMER_START, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.GAME_TIMER_STOP, reStopAt, null, null)
            expect(getGameDurationFromGameTimerEvents([startEvent, endEvent, restartEvent, reStopEvent], now)).toBe(16)
        })
        test('If timer never starts, it will return a 0', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, stopAt, null, null)
            expect(getGameDurationFromGameTimerEvents([endEvent], now)).toBe(0)
        })
    })

    describe('getFieldDurationFromPlayerTimerEvents', () => {
        test('field only (missing end) returns diff between field and now provided in 2nd parameter', () => {
            const startAt = addSeconds(now, 0)
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, now, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, startEvent, gameEnd90m], startAt)).toBe(0)
        })
        test('start + end returns diff between start + end', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, gameEnd90m], now)).toBe(17)
        })
        test('start + end + start + end returns diff between spans omitting space between stop and start', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_FIELD, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, gameEnd90m], now)).toBe(29)
        })
        test('Items should be sorted and calculated properly', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_FIELD, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, endEvent, restartEvent, startEvent, reStopEvent, gameEnd90m], now)).toBe(29)
        })
        test('Items should be presented in START/STOP order and thus will yield a different result', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_FIELD, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_FIELD, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, gameEnd90m], now)).toBe(16)
        })
        test('If timer never starts, it will return a 0', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, endEvent, gameEnd90m], now)).toBe(0)
        })
        test('If game timer is paused mid play, returns proper number of seconds', () => {
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, addSeconds(now, 10), null, null)
            const midwayGameStop = new Event(EventEnum.GAME_TIMER_STOP, addSeconds(now, 25), null, null)
            const midwayGameStart = new Event(EventEnum.GAME_TIMER_START, addSeconds(now, 35), null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, addSeconds(now, 45), null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, startEvent, midwayGameStop, midwayGameStart, endEvent, gameEnd90m], now)).toBe(25)
        })
    })

    describe('getGoalingDurationFromPlayerTimerEvents', () => {
        test('start only (missing end) returns diff between start and now provided in 2nd parameter', () => {
            const startAt = addSeconds(now, 0)
            const startEvent = new Event(EventEnum.PLAYER_TO_GOAL, now, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, startEvent, gameEnd90m], startAt)).toBe(0)
        })
        test('start + end returns diff between start + end', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const startEvent = new Event(EventEnum.PLAYER_TO_GOAL, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, gameEnd90m], now)).toBe(17)
        })
        test('start + end + start + end returns diff between spans omitting space between stop and start', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_GOAL, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_GOAL, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, gameEnd90m], now)).toBe(29)
        })
        test('Items should be sorted and calculated properly', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_GOAL, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_GOAL, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, endEvent, restartEvent, startEvent, reStopEvent, gameEnd90m], now)).toBe(29)
        })
        test('Items should be presented in START/STOP order and thus will yield a different result', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_GOAL, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_GOAL, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, gameEnd90m], now)).toBe(16)
        })
        test('If timer never starts, it will return a 0', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, endEvent, gameEnd90m], now)).toBe(0)
        })
        test('If game timer is paused mid play, returns proper number of seconds', () => {
            const startEvent = new Event(EventEnum.PLAYER_TO_GOAL, addSeconds(now, 10), null, null)
            const midwayGameStop = new Event(EventEnum.GAME_TIMER_STOP, addSeconds(now, 25), null, null)
            const midwayGameStart = new Event(EventEnum.GAME_TIMER_START, addSeconds(now, 35), null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, addSeconds(now, 45), null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, startEvent, midwayGameStop, midwayGameStart, endEvent, gameEnd90m], now)).toBe(25)
        })
    })

    describe('getBenchingDurationFromPlayerTimerEvents', () => {
        test('start only (missing end) returns diff between start and now provided in 2nd parameter', () => {
            const startAt = addSeconds(now, 0)
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, now, null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, startEvent, gameEnd90m], startAt)).toBe(0)
        })
        test('start + end returns diff between start + end', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_FIELD, stopAt, null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, gameEnd90m], now)).toBe(17)
        })
        test('start + end + start + end returns diff between spans omitting space between stop and start', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_FIELD, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_BENCH, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_FIELD, reStopAt, null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, gameEnd90m], now)).toBe(29)
        })
        test('Items should be sorted and calculated properly', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_FIELD, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_BENCH, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_FIELD, reStopAt, null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, endEvent, restartEvent, startEvent, reStopEvent, gameEnd90m], now)).toBe(29)
        })
        test('Items should be presented in START/STOP order and thus will yield a different result', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_BENCH, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_FIELD, reStopAt, null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, gameEnd90m], now)).toBe(16)
        })
        test('If timer never starts, it will return a 0', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const endEvent = new Event(EventEnum.PLAYER_TO_FIELD, stopAt, null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, endEvent, gameEnd90m], now)).toBe(0)
        })
        test('If game timer is paused mid play, returns proper number of seconds', () => {
            const startEvent = new Event(EventEnum.PLAYER_TO_BENCH, addSeconds(now, 10), null, null)
            const midwayGameStop = new Event(EventEnum.GAME_TIMER_STOP, addSeconds(now, 25), null, null)
            const midwayGameStart = new Event(EventEnum.GAME_TIMER_START, addSeconds(now, 35), null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_FIELD, addSeconds(now, 45), null, null)
            expect(getBenchingDurationFromPlayerTimerEvents([gameStart0m, startEvent, midwayGameStop, midwayGameStart, endEvent, gameEnd90m], now)).toBe(25)
        })
    })

    describe('Mixed events for goaling and field calculations', () => {
        test('Mixed goal/field should be properly taken into account to calculate field time', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const restartAt2 = addSeconds(reStopAt, 8)
            const reStopAt2 = addSeconds(restartAt2, 21)
            const startEvent = new Event(EventEnum.PLAYER_TO_FIELD, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_GOAL, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            const restartEvent2 = new Event(EventEnum.PLAYER_TO_FIELD, restartAt2, null, null)
            const reStopEvent2 = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt2, null, null)
            expect(getFieldDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, restartEvent2, reStopEvent2, gameEnd90m], now)).toBe(38)
        })
        test('Mixed goal/field should be properly taken into account to calculate goal time', () => {
            const startAt = addSeconds(now, 0)
            const stopAt = addSeconds(startAt, 17)
            const restartAt = addSeconds(stopAt, 4)
            const reStopAt = addSeconds(restartAt, 12)
            const restartAt2 = addSeconds(reStopAt, 8)
            const reStopAt2 = addSeconds(restartAt2, 21)
            const startEvent = new Event(EventEnum.PLAYER_TO_GOAL, startAt, null, null)
            const endEvent = new Event(EventEnum.PLAYER_TO_BENCH, stopAt, null, null)
            const restartEvent = new Event(EventEnum.PLAYER_TO_FIELD, restartAt, null, null)
            const reStopEvent = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt, null, null)
            const restartEvent2 = new Event(EventEnum.PLAYER_TO_GOAL, restartAt2, null, null)
            const reStopEvent2 = new Event(EventEnum.PLAYER_TO_BENCH, reStopAt2, null, null)
            expect(getGoalingDurationFromPlayerTimerEvents([gameStart0m, startEvent, endEvent, restartEvent, reStopEvent, restartEvent2, reStopEvent2, gameEnd90m], now)).toBe(38)
        })
    })

    describe('createIntervalPairsFrom', () => {
        test('Start only (missing end) returns interval between start and now provided in 2nd parameter', () => {
            const startAt = addSeconds(now, 0)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, now, null, null)
            const resultingIntervals = createIntervalPairsFrom(
                [startEvent],
                EventEnum.GAME_TIMER_START,
                [EventEnum.GAME_TIMER_STOP],
                startAt
            )
            expect(resultingIntervals).toStrictEqual([
                {start: startAt, end: now}
            ])
        })
        test('start + end returns interval of start + end', () => {
            const startAt = addSeconds(now, 0)
            const endAt = addSeconds(now, 10)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, endAt, null, null)
            const resultingIntervals = createIntervalPairsFrom(
                [startEvent, endEvent],
                EventEnum.GAME_TIMER_START,
                [EventEnum.GAME_TIMER_STOP],
                startAt
            )
            expect(resultingIntervals).toStrictEqual([
                {start: startAt, end: endAt}
            ])
        })
        test('start + end + start + end returns diff between spans omitting space between stop and start', () => {
            const startAt = addSeconds(now, 0)
            const endAt = addSeconds(now, 10)
            const startAt2 = addSeconds(now, 20)
            const endAt2 = addSeconds(now, 25)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, endAt, null, null)
            const startEvent2 = new Event(EventEnum.GAME_TIMER_START, startAt2, null, null)
            const endEvent2 = new Event(EventEnum.GAME_TIMER_STOP, endAt2, null, null)
            const resultingIntervals = createIntervalPairsFrom(
                [startEvent, endEvent, startEvent2, endEvent2],
                EventEnum.GAME_TIMER_START,
                [EventEnum.GAME_TIMER_STOP],
                startAt
            )
            expect(resultingIntervals).toStrictEqual([
                {start: startAt, end: endAt},
                {start: startAt2, end: endAt2}
            ])
        })
        test('Items should be sorted and calculated properly', () => {
            const startAt = addSeconds(now, 0)
            const endAt = addSeconds(now, 10)
            const startAt2 = addSeconds(now, 20)
            const endAt2 = addSeconds(now, 25)
            const endEvent2 = new Event(EventEnum.GAME_TIMER_STOP, endAt2, null, null)
            const startEvent = new Event(EventEnum.GAME_TIMER_START, startAt, null, null)
            const startEvent2 = new Event(EventEnum.GAME_TIMER_START, startAt2, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_STOP, endAt, null, null)
            const resultingIntervals = createIntervalPairsFrom(
                [startEvent, endEvent, startEvent2, endEvent2],
                EventEnum.GAME_TIMER_START,
                [EventEnum.GAME_TIMER_STOP],
                startAt
            )
            expect(resultingIntervals).toStrictEqual([
                {start: startAt, end: endAt},
                {start: startAt2, end: endAt2}
            ])
        })
        test('Items presented in weird orders should be discarded as invalid timeline events', () => {
            const startAt = addSeconds(now, 0)
            const endAt = addSeconds(now, 10)
            const startAt2 = addSeconds(now, 20)
            const endAt2 = addSeconds(now, 25)
            const startEvent = new Event(EventEnum.GAME_TIMER_STOP, startAt, null, null)
            const endEvent = new Event(EventEnum.GAME_TIMER_START, endAt, null, null)
            const startEvent2 = new Event(EventEnum.GAME_TIMER_START, startAt2, null, null)
            const endEvent2 = new Event(EventEnum.GAME_TIMER_STOP, endAt2, null, null)
            const resultingIntervals = createIntervalPairsFrom(
                [startEvent, endEvent, startEvent2, endEvent2],
                EventEnum.GAME_TIMER_START,
                [EventEnum.GAME_TIMER_STOP],
                startAt
            )
            expect(resultingIntervals).toStrictEqual([
                {start: endAt, end: endAt2}
            ])
        })
        test('If timer never starts, it will return an empty array', () => {
            const resultingIntervals = createIntervalPairsFrom(
                [],
                EventEnum.GAME_TIMER_START,
                [EventEnum.GAME_TIMER_STOP],
                new Date()
            )
            expect(resultingIntervals).toStrictEqual([])
        })
    })

    describe('getOverlappingMilliseconds', () => {

        /**
         * 1: [                   ]
         * 2:                     [                  ]
         * Result: Nothing
         */
        test('Non overlapping intervals return 0', () => {
            const startAt1 = addSeconds(now, 0)
            const endAt1 = addSeconds(now, 10)
            const startAt2 = addSeconds(now, 20)
            const endAt2 = addSeconds(now, 30)
            expect(getOverlappingMilliseconds(
                {start: startAt1, end: endAt1},
                {start: startAt2, end: endAt2}
            )).toBe(0)
        })

        /**
         * 1: [                   ]
         * 2:            [                  ]
         * Result:       [        ]
         */
        test('Range 1 intersecting before Range 2 should return the intersection starting at range 2 until end of range 1', () => {
            const startAt1 = addSeconds(now, 0)
            const endAt1 = addSeconds(now, 20)
            const startAt2 = addSeconds(now, 10)
            const endAt2 = addSeconds(now, 30)
            expect(getOverlappingMilliseconds(
                {start: startAt1, end: endAt1},
                {start: startAt2, end: endAt2}
            )).toBe(10 * 1000)
        })

        /**
         * 1:            [                   ]
         * 2: [                  ]
         * Result:       [       ]
         */
        test('Range 1 intersecting after Range 2 should return the intersection starting at range 1 until end of range 2', () => {
            const startAt1 = addSeconds(now, 12)
            const endAt1 = addSeconds(now, 37)
            const startAt2 = addSeconds(now, 1)
            const endAt2 = addSeconds(now, 25)
            expect(getOverlappingMilliseconds(
                {start: startAt1, end: endAt1},
                {start: startAt2, end: endAt2}
            )).toBe(13 * 1000)
        })

        /**
         * 1: [                                ]
         * 2:            [                  ]
         * Result:       [                  ]
         */
        test('Range 1 overlaps Range 2 should return range 2', () => {
            const startAt1 = addSeconds(now, 0)
            const endAt1 = addSeconds(now, 50)
            const startAt2 = addSeconds(now, 15)
            const endAt2 = addSeconds(now, 32)
            expect(getOverlappingMilliseconds(
                {start: startAt1, end: endAt1},
                {start: startAt2, end: endAt2}
            )).toBe(17 * 1000)
        })

        /**
         * 1: [                                ]
         * 2:            [                  ]
         * Result:       [                  ]
         */
        test('Range 2 overlaps Range 1 should return range 2', () => {
            const startAt1 = addSeconds(now, 31)
            const endAt1 = addSeconds(now, 39)
            const startAt2 = addSeconds(now, 11)
            const endAt2 = addSeconds(now, 62)
            expect(getOverlappingMilliseconds(
                {start: startAt1, end: endAt1},
                {start: startAt2, end: endAt2}
            )).toBe(8 * 1000)
        })
    })

})