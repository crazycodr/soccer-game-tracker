import {defineStore, storeToRefs} from 'pinia'
import {computed, ref} from 'vue'
import {useStorage} from '@vueuse/core'
import {Game} from '@/stores/models/Game'
import {usePlayerStore} from '@/stores/PlayerStore'
import {forEach} from 'lodash'
import {EventEnum, GameEvent} from '@/stores/models/GameEvent'
import type {Player} from '@/stores/models/Player'
import type {Team} from '@/stores/models/Team'
import {v4, validate} from "uuid";

export const useGameStore = defineStore('game', () => {

  setInterval(tick, 1000)

  const STAT_MODE_ADDITION = 1
  const STAT_MODE_REMOVAL = 2

  const game = useStorage<Game>('game', new Game(), localStorage, {mergeDefaults: true})
  if (!validate(game.value.uuid) || game.value.uuid === undefined) {
    game.value.uuid = v4()
  }

  const statMode = ref(STAT_MODE_ADDITION)

  const {getPlayers} = storeToRefs(usePlayerStore())

  const getGame = computed((): Game => {
    return game.value
  })

  const getStatMode = computed(() => {
    return statMode.value
  })

  const inAdditionMode = computed((): boolean => {
    return statMode.value === STAT_MODE_ADDITION
  })

  const inRemovalMode = computed((): boolean => {
    return statMode.value === STAT_MODE_REMOVAL
  })

  function setToAdditionMode() {
    statMode.value = STAT_MODE_ADDITION
  }

  function setToRemovalMode() {
    statMode.value = STAT_MODE_REMOVAL
  }

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

  function resetStatuses() {
    pauseGame()
    forEach(getPlayers.value, (player: Player) => {
      player.status = 'playing'
    })
  }

  function resetTimers() {
    game.value.seconds = 0
    forEach(getPlayers.value, (player: Player) => {
      player.gameSeconds = 0
      player.benchSeconds = 0
      player.status = 'playing'
    })
  }

  function resetGoals() {
    forEach(getPlayers.value, (player: Player) => {
      player.goals = 0
      player.passes = 0
    })
  }

  function resetPasses() {
    forEach(getPlayers.value, (player: Player) => {
      player.goals = 0
      player.passes = 0
    })
  }

  return {
    getGame,
    pauseGame,
    unpauseGame,
    resetTimers,
    resetStatuses,
    resetGoals,
    resetPasses,
    inAdditionMode,
    inRemovalMode,
    setToAdditionMode,
    setToRemovalMode,
    getStatMode,
    STAT_MODE_ADDITION,
    STAT_MODE_REMOVAL
  }
})

export const useEventStore = defineStore('events', () => {

  const events = useStorage<GameEvent[]>('events', [] as GameEvent[], localStorage, {mergeDefaults: true})

  const getEvents = computed(() => events.value)

  function addEvent(event: GameEvent): void {
    events.value.push(event)
  }

  function addGoal(atSeconds: number, forTeam: Team, byPlayer: Player): void {
    const newEvent = new GameEvent(
        EventEnum.GOAL,
        atSeconds,
        forTeam.uuid,
        byPlayer.uuid
    )
    events.value.push(newEvent)
  }

  function addPass(atSeconds: number, forTeam: Team, byPlayer: Player): void {
    const newEvent = new GameEvent(
        EventEnum.PASS,
        atSeconds,
        forTeam.uuid,
        byPlayer.uuid
    )
    events.value.push(newEvent)
  }

  function revertGoal(atSeconds: number, forTeam: Team, byPlayer: Player): void {
    const newEvent = new GameEvent(
        EventEnum.REVERTED_GOAL,
        atSeconds,
        forTeam.uuid,
        byPlayer.uuid
    )
    events.value.push(newEvent)
  }

  function revertPass(atSeconds: number, forTeam: Team, byPlayer: Player): void {
    const newEvent = new GameEvent(
        EventEnum.REVERTED_PASS,
        atSeconds,
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
    resetEvents
  }

})
