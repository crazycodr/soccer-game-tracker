import { defineStore } from 'pinia'
import {computed} from "vue"
import {filter, first, forEach} from "lodash"
import {useLocalStorage} from "@vueuse/core"

export class PlayerAlreadyExistsException implements Error {
  public readonly message: string = 'Player name already exists in the game'
  public readonly name: string = 'PlayerAlreadyExists'
}

export class TeamAlreadyExistsException implements Error {
  public readonly message: string = 'Team name already exists in the game'
  public readonly name: string = 'TeamAlreadyExists'
}

class PlayerNotFoundException implements Error {
  public readonly message: string = 'Player not found'
  public readonly name: string = 'PlayerNotFound'
}

class TeamNotFoundException implements Error {
  public readonly message: string = 'Team not found'
  public readonly name: string = 'TeamNotFound'
}

export const useGameStore = defineStore('game', () => {

  setInterval(tick, 1000);

  const players = useLocalStorage('players', [] as Player[])
  const teams = useLocalStorage('teams', [] as Team[])
  const game = useLocalStorage('game', new Game())

  const getPlayers = computed((): Player[] => {
    return players.value
  })

  const getTeams = computed((): Team[] => {
    return teams.value
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

  function addTeam(addedTeam: Team) {
    const existingTeams: Team[] = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name === addedTeam.name
    })
    if (existingTeams.length) {
      throw new TeamAlreadyExistsException()
    }
    teams.value.push(addedTeam)
  }

  function setTeamColor(teamName: string, color: string) {
    const existingTeams: Team[] = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name === teamName
    })
    if (existingTeams.length === 0) {
      throw new TeamNotFoundException()
    }
    existingTeams[0].color = color
  }

  function removePlayerByName(name: string) {
    players.value = filter(players.value, (existingPlayer: Player) => {
      return existingPlayer.name !== name
    })
  }

  function removeTeamByName(name: string) {
    teams.value = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name !== name
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

  const getGame = computed((): Game => {
    return game.value
  })

  function pauseGame() {
    game.value.status = 'paused'
  }

  function unpauseGame() {
    game.value.status = 'playing'
  }

  function tick() {
    if (game.value.status === 'playing') {
      game.value.seconds++
      forEach(getPlayers.value, (player: Player) => {
        if (player.status === 'playing') {
          player.gameSeconds++
        } else {
          player.benchSeconds++
        }
      })
    }
  }

  function reset() {
    game.value.seconds = 0
    forEach(getPlayers.value, (player: Player) => {
      player.gameSeconds = 0
      player.benchSeconds = 0
      player.status = 'playing'
      player.goals = 0
      player.passes = 0
    })
  }

  return {getPlayers, increaseGoals, increasePasses, addPlayer, setPlayerTeam, setTeamColor, removePlayerByName, getTeams, addTeam, removeTeamByName, benchPlayer, unbenchPlayer, getGame, pauseGame, unpauseGame, reset}
})

export class Player {

  public readonly name: string
  public team: string = ''
  public status: string = 'playing'
  public gameSeconds: number = 0
  public benchSeconds: number = 0
  public goals: number = 0
  public passes: number = 0

  constructor(name: string){
    this.name = name
  }
}

export class Team {

  public readonly name: string
  public color: string = 'white';

  constructor(name: string){
    this.name = name
  }
}

export class Game {
  public status: string = 'paused'
  public seconds: number = 0;
}