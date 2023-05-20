import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {EventEnum, GameEvent} from "@/stores/models/GameEvent";
import {each} from "lodash";
import {GameEventReferences} from "@/stores/models/GameEventReferences";
import {computed} from "vue";
import type {Team} from "@/stores/models/Team";
import type {Player} from "@/stores/models/Player";

export const useEventStore = defineStore('events', () => {

    const events = useStorage<GameEvent[]>('events', [] as GameEvent[], localStorage, {mergeDefaults: true})
    each(events.value, (event: GameEvent) => {
        if (!event.references) {
            event.references = new GameEventReferences()
        }
    })

    const getEvents = computed(() => events.value)

    function addEvent(event: GameEvent): void {
        events.value.push(event)
    }

    function startTimer(on: Date): void {
        const newEvent = new GameEvent(
            EventEnum.GAME_TIMER_START,
            on,
            null,
            null
        )
        events.value.push(newEvent)
    }

    function stopTimer(on: Date): void {
        const newEvent = new GameEvent(
            EventEnum.GAME_TIMER_STOP,
            on,
            null,
            null
        )
        events.value.push(newEvent)
    }

    function sendPlayerToField(on: Date, team: Team, player: Player): void {
        const newEvent = new GameEvent(
            EventEnum.PLAYER_TO_FIELD,
            on,
            team.uuid,
            player.uuid
        )
        events.value.push(newEvent)
    }

    function sendPlayerToBench(on: Date, team: Team, player: Player): void {
        const newEvent = new GameEvent(
            EventEnum.PLAYER_TO_BENCH,
            on,
            team.uuid,
            player.uuid
        )
        events.value.push(newEvent)
    }

    function sendPlayerToGoal(on: Date, team: Team, player: Player): void {
        const newEvent = new GameEvent(
            EventEnum.PLAYER_TO_GOAL,
            on,
            team.uuid,
            player.uuid
        )
        events.value.push(newEvent)
    }

    function addGoal(on: Date, forTeam: Team, byPlayer: Player): void {
        const newEvent = new GameEvent(
            EventEnum.GOAL,
            on,
            forTeam.uuid,
            byPlayer.uuid
        )
        events.value.push(newEvent)
    }

    function addPass(on: Date, forTeam: Team, byPlayer: Player): void {
        const newEvent = new GameEvent(
            EventEnum.PASS,
            on,
            forTeam.uuid,
            byPlayer.uuid
        )
        events.value.push(newEvent)
    }

    function revertGoal(on: Date, forTeam: Team, byPlayer: Player): void {
        const newEvent = new GameEvent(
            EventEnum.REVERTED_GOAL,
            on,
            forTeam.uuid,
            byPlayer.uuid
        )
        events.value.push(newEvent)
    }

    function revertPass(on: Date, forTeam: Team, byPlayer: Player): void {
        const newEvent = new GameEvent(
            EventEnum.REVERTED_PASS,
            on,
            forTeam.uuid,
            byPlayer.uuid
        )
        events.value.push(newEvent)
    }

    function resetEvents(): void {
        events.value = []
    }

    return {
        getEvents,
        addEvent,
        addGoal,
        addPass,
        revertGoal,
        revertPass,
        resetEvents,
        startTimer,
        stopTimer,
        sendPlayerToField,
        sendPlayerToBench,
        sendPlayerToGoal
    }

})