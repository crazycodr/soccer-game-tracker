import {defineStore, storeToRefs} from 'pinia'
import {computed} from 'vue'
import {each, filter, find} from 'lodash'
import {useStorage} from '@vueuse/core'
import {PlayerAlreadyExistsException} from '@/stores/exceptions/PlayerAlreadyExistsException'
import {PlayerNotFoundException} from '@/stores/exceptions/PlayerNotFoundException'
import {v4, validate} from "uuid";
import {RegistryPlayer} from "@/stores/models/RegistryPlayer";
import type {Player} from "@/stores/models/Player";
import {RegistryGame} from "@/stores/models/RegistryGame";
import type {Game} from "@/stores/models/Game";
import {GameAlreadyExistsException} from "@/stores/exceptions/GameAlreadyExistsException";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import {useEventStore} from "@/stores/GameStore";
import {GameNotFoundException} from "@/stores/exceptions/GameNotFoundException";

export const useRegistryStore = defineStore('registry', () => {

    const {getPlayers} = storeToRefs(usePlayerStore())
    const {getTeams} = storeToRefs(useTeamStore())
    const {getEvents} = storeToRefs(useEventStore())

    const games = useStorage<RegistryGame[]>('gameRegistry', [] as RegistryGame[], localStorage, {mergeDefaults: true})
    each(games.value, (game: RegistryGame) => {
        if (!validate(game.uuid) || game.uuid === undefined) {
            game.uuid = v4()
        }
    })

    const getGamesFromRegistry = computed((): RegistryGame[] => {
        return games.value
    })

    function getGameFromRegistryByUuid(uuid: string): RegistryGame | null {
        const existingGame = find(games.value, (game: RegistryGame) => game.uuid === uuid)
        if (!existingGame) {
            return null
        }
        return existingGame
    }

    function addGameToRegistry(addedGame: Game): void {
        const existingGame = getGameFromRegistryByUuid(addedGame.uuid)
        if (existingGame) {
            throw new GameAlreadyExistsException()
        }
        const createdGame = new RegistryGame()
        createdGame.uuid = addedGame.uuid
        createdGame.status = addedGame.status
        createdGame.seconds = addedGame.seconds
        createdGame.players = getPlayers.value
        createdGame.teams = getTeams.value
        createdGame.events = getEvents.value
        games.value.push(createdGame)
    }

    function updateGameInRegistry(updatedGame: Game): void {
        const existingGame = getGameFromRegistryByUuid(updatedGame.uuid)
        if (!existingGame) {
            throw new GameNotFoundException()
        }
        existingGame.status = updatedGame.status
        existingGame.seconds = updatedGame.seconds
        existingGame.players = getPlayers.value
        existingGame.teams = getTeams.value
        existingGame.events = getEvents.value
    }

    function upsertGameInRegistry(upsertedGame: Game): void {
        const existingGame = getGameFromRegistryByUuid(upsertedGame.uuid)
        if (existingGame) {
            updateGameInRegistry(upsertedGame)
        } else {
            addGameToRegistry(upsertedGame)
        }
    }

    const players = useStorage<RegistryPlayer[]>('playerRegistry', [] as RegistryPlayer[], localStorage, {mergeDefaults: true})
    each(players.value, (player: RegistryPlayer) => {
        if (!validate(player.uuid) || player.uuid === undefined) {
            player.uuid = v4()
        }
        if (player.jacketNumber === undefined) {
            player.jacketNumber = ''
        }
    })

    const getPlayersFromRegistry = computed((): RegistryPlayer[] => {
        return players.value
    })

    function getPlayerFromRegistryByUuid(uuid: string): RegistryPlayer | null {
        const existingPlayer = find(players.value, (player: RegistryPlayer) => player.uuid === uuid)
        if (!existingPlayer) {
            return null
        }
        return existingPlayer
    }

    function addPlayerToRegistry(addedPlayer: Player): void {
        const existingPlayer = getPlayerFromRegistryByUuid(addedPlayer.uuid)
        if (existingPlayer) {
            throw new PlayerAlreadyExistsException()
        }
        const createdPlayer = new RegistryPlayer(addedPlayer.uuid, addedPlayer.name)
        createdPlayer.jacketNumber = addedPlayer.jacketNumber
        players.value.push(createdPlayer)
    }

    function updatePlayerInRegistry(updatedPlayer: Player): void {
        const existingPlayer = getPlayerFromRegistryByUuid(updatedPlayer.uuid)
        if (!existingPlayer) {
            throw new PlayerNotFoundException()
        }
        existingPlayer.name = updatedPlayer.name
        existingPlayer.jacketNumber = updatedPlayer.jacketNumber
    }

    function upsertPlayerInRegistry(upsertedPlayer: Player): void {
        const existingPlayer = getPlayerFromRegistryByUuid(upsertedPlayer.uuid)
        if (existingPlayer) {
            updatePlayerInRegistry(upsertedPlayer)
        } else {
            addPlayerToRegistry(upsertedPlayer)
        }
    }

    function erasePlayerFromRegistry(erasedPlayer: RegistryPlayer) {
        const existingPlayer = getPlayerFromRegistryByUuid(erasedPlayer.uuid)
        if (!existingPlayer) {
            throw new PlayerNotFoundException()
        }
        players.value = filter(players.value, (player: RegistryPlayer) => player.uuid !== erasedPlayer.uuid)
    }

    return {
        getPlayersFromRegistry,
        getPlayerFromRegistryByUuid,
        upsertPlayerInRegistry,
        erasePlayerFromRegistry,
        getGamesFromRegistry,
        getGameFromRegistryByUuid,
        addGameToRegistry,
        updateGameInRegistry,
        upsertGameInRegistry
    }
})