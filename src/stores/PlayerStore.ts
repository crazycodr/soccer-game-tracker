import {defineStore} from 'pinia'
import {computed} from 'vue'
import {filter, find, first} from 'lodash'
import {PlayerAlreadyExistsException} from '@/stores/exceptions/PlayerAlreadyExistsException'
import {PlayerNotFoundException} from '@/stores/exceptions/PlayerNotFoundException'
import {Player, PlayerStatusEnum} from "@/stores/models/Player";
import type {RegistryPlayer} from "@/stores/models/RegistryPlayer";
import {useEventStore} from "@/stores/EventStore";
import {useTeamStore} from "@/stores/TeamStore";
import {useGameStore} from "@/stores/GameStore";

export const usePlayerStore = defineStore('player', () => {

  const {addGoal, addPass, sendPlayerToField, sendPlayerToGoal, sendPlayerToBench} = useEventStore()
  const {getTeamByUuid} = useTeamStore()

  const getPlayers = computed((): Player[] => {
    return useGameStore().getGame.players
  })

  function getPlayerByUuid(uuid: string): Player {
    const player = find(useGameStore().getGame.players, (player: Player) => player.uuid === uuid)
    if (!player) {
      throw new PlayerNotFoundException()
    }
    return player
  }

  function addPlayer(addedPlayer: Player) {
    const existingPlayer = find(useGameStore().getGame.players, (player: Player) => player.uuid === addedPlayer.uuid)
    if (existingPlayer) {
      throw new PlayerAlreadyExistsException()
    }
    useGameStore().getGame.players.push(addedPlayer)
  }

  function updatePlayer(uuid: string, name: string, teamUuid: string, jacketNumber: string) {
    const player = find(useGameStore().getGame.players, (player: Player) => {
      return player.uuid === uuid
    })
    if (!player) {
      throw new PlayerNotFoundException()
    }
    player.name = name
    player.team = teamUuid
    player.jacketNumber = jacketNumber
  }

  function removePlayerByUuid(uuid: string) {
    useGameStore().getGame.players = filter(useGameStore().getGame.players, (existingPlayer: Player) => {
      return existingPlayer.uuid !== uuid
    })
  }

  function sendToBench(uuid: string) {
    const matchingPlayers: Player[] = filter(useGameStore().getGame.players, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    const team = getTeamByUuid(player.team)
    player.status = PlayerStatusEnum.benching
    sendPlayerToBench(
        new Date(),
        team,
        player
    )
  }

  function sendToField(uuid: string) {
    const matchingPlayers: Player[] = filter(useGameStore().getGame.players, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    const team = getTeamByUuid(player.team)
    player.status = PlayerStatusEnum.playing
    sendPlayerToField(
        new Date(),
        team,
        player
    )
  }

  function sendToGoal(uuid: string) {
    const matchingPlayers: Player[] = filter(useGameStore().getGame.players, (existingPlayer: Player) => {
      return existingPlayer.uuid === uuid
    })
    if (matchingPlayers.length === 0) {
      throw new PlayerNotFoundException()
    }
    const player = <Player>first(matchingPlayers)
    const team = getTeamByUuid(player.team)
    player.status = PlayerStatusEnum.goaling
    sendPlayerToGoal(
        new Date(),
        team,
        player
    )
  }

  function increaseGoals(uuid: string) {
    const player = getPlayerByUuid(uuid)
    const team = getTeamByUuid(player.team)
    addGoal(
        new Date(),
        team,
        player
    )
  }

  function increasePasses(uuid: string) {
    const player = getPlayerByUuid(uuid)
    const team = getTeamByUuid(player.team)
    addPass(
        new Date(),
        team,
        player
    )
  }

  function upsertRegistryPlayerInGame(upsertedRegistryPlayer: RegistryPlayer): void {
    try {
      const gamePlayer = getPlayerByUuid(upsertedRegistryPlayer.uuid)
      updatePlayer(
          upsertedRegistryPlayer.uuid,
          upsertedRegistryPlayer.name,
          gamePlayer.team,
          upsertedRegistryPlayer.jacketNumber
      )
    } catch (ex) {
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
    removePlayerByUuid,
    sendToBench,
    sendToField,
    sendToGoal
  }
})