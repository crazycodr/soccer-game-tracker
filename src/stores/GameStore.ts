import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useInterval, useStorage} from '@vueuse/core'
import {Game} from '@/stores/models/Game'
import {v4, validate} from "uuid";

export const useGameStore = defineStore('game', () => {

  const { pause, resume } = useInterval(1000, { controls: true, callback: tick });

  const tickCounter = ref(0)

  const game = useStorage<Game>('game', new Game(), localStorage, {mergeDefaults: true})
  if (!validate(game.value.uuid) || game.value.uuid === undefined) {
    game.value.uuid = v4()
  }

  if (game.value.status === 'playing') {
    resume()
  }

  const getGame = computed((): Game => {
    return game.value
  })

  function pauseGame() {
    game.value.status = 'paused'
    pause()
  }

  function unpauseGame() {
    game.value.status = 'playing'
    resume()
  }

  function tick() {
    if (game.value.status === 'playing') {
      tickCounter.value++
    }
  }

  return {
    tickCounter,
    getGame,
    pauseGame,
    unpauseGame
  }
})


