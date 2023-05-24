import {defineStore} from "pinia";
import {EventEnum, Event} from "@/stores/models/Event";
import {computed} from "vue";
import type {Team} from "@/stores/models/Team";
import type {Player} from "@/stores/models/Player";
import {useGameStore} from "@/stores/GameStore";

export const useEventStore = defineStore('events', () => {

    const getEvents = computed(() => {
        return useGameStore().getGame.events
    })

    function addEvent(event: Event): void {
        useGameStore().getGame.events.push(event)
    }

    function startTimer(on: Date): void {
        const newEvent = new Event(
            EventEnum.GAME_TIMER_START,
            on,
            null,
            null
        )
        useGameStore().getGame.events.push(newEvent)
    }

    function stopTimer(on: Date): void {
        const newEvent = new Event(
            EventEnum.GAME_TIMER_STOP,
            on,
            null,
            null
        )
        useGameStore().getGame.events.push(newEvent)
    }

    function sendPlayerToField(on: Date, team: Team, player: Player): void {
        const newEvent = new Event(
            EventEnum.PLAYER_TO_FIELD,
            on,
            team.uuid,
            player.uuid
        )
        useGameStore().getGame.events.push(newEvent)
    }

    function sendPlayerToBench(on: Date, team: Team, player: Player): void {
        const newEvent = new Event(
            EventEnum.PLAYER_TO_BENCH,
            on,
            team.uuid,
            player.uuid
        )
        useGameStore().getGame.events.push(newEvent)
    }

    function sendPlayerToGoal(on: Date, team: Team, player: Player): void {
        const newEvent = new Event(
            EventEnum.PLAYER_TO_GOAL,
            on,
            team.uuid,
            player.uuid
        )
        useGameStore().getGame.events.push(newEvent)
    }

    function addGoal(on: Date, forTeam: Team, byPlayer: Player, ): void {
        const newEvent = new Event(
            EventEnum.GOAL,
            on,
            forTeam.uuid,
            byPlayer.uuid
        )
        useGameStore().getGame.events.push(newEvent)
    }

    function addPass(on: Date, forTeam: Team, byPlayer: Player): void {
        const newEvent = new Event(
            EventEnum.PASS,
            on,
            forTeam.uuid,
            byPlayer.uuid
        )
        useGameStore().getGame.events.push(newEvent)
    }

    return {
        getEvents,
        addEvent,
        addGoal,
        addPass,
        startTimer,
        stopTimer,
        sendPlayerToField,
        sendPlayerToBench,
        sendPlayerToGoal
    }

})