import {defineStore, storeToRefs} from 'pinia'
import {computed, ref} from 'vue'
import {useStorage} from '@vueuse/core'
import {Game} from "@/stores/models/Game";
import {usePlayerStore} from "@/stores/PlayerStore";
import type {Player} from "@/stores/models/Player";
import {forEach} from "lodash";

export const useGameStore = defineStore('game', () => {

  setInterval(tick, 1000)

  const STAT_MODE_ADDITION = 1;
  const STAT_MODE_REMOVAL = 2;

  const game = useStorage<Game>('game', new Game(), localStorage, {mergeDefaults: true})
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
    statMode.value = STAT_MODE_ADDITION;
  }

  function setToRemovalMode() {
    statMode.value = STAT_MODE_REMOVAL;
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

