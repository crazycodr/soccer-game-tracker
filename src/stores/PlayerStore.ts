import {defineStore} from 'pinia'
import {computed} from 'vue'
import {each, filter, find, first} from 'lodash'
import {useStorage} from '@vueuse/core'
import {PlayerAlreadyExistsException} from '@/stores/exceptions/PlayerAlreadyExistsException'
import {PlayerNotFoundException} from '@/stores/exceptions/PlayerNotFoundException'
import {Player} from "@/stores/models/Player";
import {v4, validate} from "uuid";
import type {RegistryPlayer} from "@/stores/models/RegistryPlayer";

export const usePlayerStore = defineStore('player', () => {

  const players = useStorage<Player[]>('players', [] as Player[], localStorage, {mergeDefaults: true})
  each(players.value, (player: Player) => {
    if (!validate(player.uuid) || player.uuid === undefined) {
      player.uuid = v4()
    }
    if (player.jacketNumber === undefined) {
      player.jacketNumber = ''
    }
  })

  const getPlayers = computed((): Player[] => {
    return players.value
  })

  function getPlayerByUuid(uuid: string): Player {
    const player = find(players.value, (player: Player) => player.uuid === uuid)
    if (!player) {
      throw new PlayerNotFoundException()
    }
    return player
  }

  function addPlayer(addedPlayer: Player) {
    const existingPlayer = find(players.value, (player: Player) => player.uuid === addedPlayer.uuid)
    if (existingPlayer) {
      throw new PlayerAlreadyExistsException()
    }
    players.value.push(addedPlayer)
  }

  function updatePlayer(uuid: string, name: string, teamUuid: string, jacketNumber: string) {
    const player = find(players.value, (player: Player) => {
      return player.uuid === uuid
    })
    if (!player) {
      throw new PlayerNotFoundException()
    }
    player.name = name
    player.team = teamUuid
    player.jacketNumber = jacketNumber
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

  function upsertRegistryPlayerInGame(upsertedRegistryPlayer: RegistryPlayer): void {
    try {
      const gamePlayer = getPlayerByUuid(upsertedRegistryPlayer.uuid)
      console.log('updating')
      updatePlayer(
          upsertedRegistryPlayer.uuid,
          upsertedRegistryPlayer.name,
          gamePlayer.team,
          upsertedRegistryPlayer.jacketNumber
      )
    } catch (ex) {
      console.log('creating')
      const newPlayer = new Player(upsertedRegistryPlayer.name)
      newPlayer.uuid = upsertedRegistryPlayer.uuid
      newPlayer.jacketNumber = upsertedRegistryPlayer.jacketNumber
      addPlayer(newPlayer)
    }
  }

  return {
    getPlayers,
    getPlayerByUuid,
    updatePlayer,
    upsertRegistryPlayerInGame,
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