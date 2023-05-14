import {defineStore} from 'pinia'
import {computed} from 'vue'
import {each, filter, find} from 'lodash'
import {useStorage} from '@vueuse/core'
import {PlayerAlreadyExistsException} from '@/stores/exceptions/PlayerAlreadyExistsException'
import {PlayerNotFoundException} from '@/stores/exceptions/PlayerNotFoundException'
import {v4, validate} from "uuid";
import {RegistryPlayer} from "@/stores/models/RegistryPlayer";
import type {Player} from "@/stores/models/Player";

export const useRegistryStore = defineStore('registry', () => {

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
        addPlayerToRegistry,
        updatePlayerInRegistry,
        upsertPlayerInRegistry,
        erasePlayerFromRegistry
    }
})