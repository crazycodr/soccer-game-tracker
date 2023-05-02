import {defineStore} from 'pinia'
import {computed} from 'vue'
import {filter, first} from 'lodash'
import {useLocalStorage} from '@vueuse/core'
import {PlayerAlreadyExistsException} from '@/stores/exceptions/PlayerAlreadyExistsException'
import {PlayerNotFoundException} from '@/stores/exceptions/PlayerNotFoundException'
import type {Player} from "@/stores/models/Player";

export const usePlayerStore = defineStore('player', () => {

  const players = useLocalStorage('players', [] as Player[])

  const getPlayers = computed((): Player[] => {
    return players.value
  })

  function addPlayer(addedPlayer: Player) {
    const existingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name === addedPlayer.name
    })
    if (existingPlayers.length) {
      throw new PlayerAlreadyExistsException()
    }
    players.value.push(addedPlayer)
  }

  function setPlayerTeam(name: string, team: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name === name
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.team = team
  }

  function removePlayerByName(name: string) {
    players.value = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name !== name
    })
  }

  function benchPlayer(name: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name === name
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.status = 'benching'
  }

  function unbenchPlayer(name: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name === name
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.status = 'playing'
  }

  function increaseGoals(name: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name === name
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.goals++
  }

  function increasePasses(name: string) {
    const matchingPlayers: Player[] = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name === name
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    player.passes++
  }

  return {getPlayers, increaseGoals, increasePasses, addPlayer, setPlayerTeam, removePlayerByName, benchPlayer, unbenchPlayer}
})