import {defineStore} from 'pinia'
import {computed} from 'vue'
import {each, filter, first} from 'lodash'
import {useStorage} from '@vueuse/core'
import {PlayerAlreadyExistsException} from '@/stores/exceptions/PlayerAlreadyExistsException'
import {PlayerNotFoundException} from '@/stores/exceptions/PlayerNotFoundException'
import type {Player} from "@/stores/models/Player";
import {v4, validate} from "uuid";

export const usePlayerStore = defineStore('player', () => {

  const players = useStorage<Player[]>('players', [] as Player[], localStorage, {mergeDefaults: true})
  each(players.value, (player: Player) => {
    if (!validate(player.uuid) || player.uuid === undefined) {
      player.uuid = v4()
    }
  })

  const getPlayers = computed((): Player[] => {
    return players.value
  })

  function addPlayer(addedPlayer: Player) {
    const existingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === addedPlayer.uuid
    })
    if (existingPlayers.length) {
      throw new PlayerAlreadyExistsException()
    }
    players.value.push(addedPlayer)
  }

  function setPlayerTeam(uuid: string, team: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.team = team
  }

  function removePlayerByUuid(uuid: string) {
    players.value = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid !== uuid
    })
  }

  function benchPlayer(uuid: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.status = 'benching'
  }

  function unbenchPlayer(uuid: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.status = 'playing'
  }

  function increaseGoals(uuid: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.goals++
  }

  function increasePasses(uuid: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.passes++
  }

  function decreaseGoals(uuid: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    if (player.goals === 0) {
      return
    }
    player.goals--
  }

  function decreasePasses(uuid: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    if (player.passes === 0) {
      return
    }
    player.passes--
  }

  return {
    getPlayers,
    increaseGoals,
    increasePasses,
    addPlayer,
    setPlayerTeam,
    removePlayerByUuid,
    benchPlayer,
    unbenchPlayer,
    decreaseGoals,
    decreasePasses
  }
})