import {defineStore} from "pinia";
import {Event, EventEnum} from "@/stores/models/Event";
import {computed} from "vue";
import type {Team} from "@/stores/models/Team";
import type {Player} from "@/stores/models/Player";
import {PlayerStatusEnum} from "@/stores/models/Player";
import {useGameStore} from "@/stores/GameStore";
import {reject} from "lodash";

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
        player.status = PlayerStatusEnum.playing
    }

    function sendPlayerToBench(on: Date, team: Team, player: Player): void {
        const newEvent = new Event(
            EventEnum.PLAYER_TO_BENCH,
            on,
            team.uuid,
            player.uuid
        )
        useGameStore().getGame.events.push(newEvent)
        player.status = PlayerStatusEnum.benching
    }

    function sendPlayerToGoal(on: Date, team: Team, player: Player): void {
        const newEvent = new Event(
            EventEnum.PLAYER_TO_GOAL,
            on,
            team.uuid,
            player.uuid
        )
        useGameStore().getGame.events.push(newEvent)
        player.status = PlayerStatusEnum.goaling
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

    function deleteEvent(deletedEvent: Event) {
        useGameStore().getGame.events = reject(
            useGameStore().getGame.events,
            (event: Event) => event.uuid === deletedEvent.uuid
        )
    }

    return {
        getEvents,
        addEvent,
        deleteEvent,
        addGoal,
        addPass,
        startTimer,
        stopTimer,
        sendPlayerToField,
        sendPlayerToBench,
        sendPlayerToGoal
    }

})