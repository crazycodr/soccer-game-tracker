import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useInterval, useStorage} from '@vueuse/core'
import {Game, GameStatusEnum} from '@/stores/models/Game'
import {usePlayerStore} from "@/stores/PlayerStore";
import {each, filter} from "lodash";
import {Player, PlayerStatusEnum} from "@/stores/models/Player";
import {useEventStore} from "@/stores/EventStore";
import {
  getBenchingDurationFromPlayerTimerEvents,
  getFieldDurationFromPlayerTimerEvents,
  getGoalingDurationFromPlayerTimerEvents
} from "@/modules/time/TimeCalculation";
import type {Event} from "@/stores/models/Event";

export const useGameStore = defineStore('game', () => {

  const { pause, resume } = useInterval(1000, { controls: true, callback: tick });
  useInterval(10000, { controls: true, callback: recalculateStats });

  const tickCounter = ref(0)

  const game = useStorage<Game>('game', new Game(), localStorage, {mergeDefaults: true})

  if (game.value.status === GameStatusEnum.PLAYING) {
    resume()
  }

  const getGame = computed((): Game => {
    return game.value
  })

  const isTimerRunning = computed(() => {
    return game.value.status === GameStatusEnum.PLAYING
  })

  function resetGame() {
    game.value = new Game()
    pause()
  }

  function startGame() {
    game.value.status = GameStatusEnum.PLAYING
    resume()
  }

  function pauseGame() {
    game.value.status = GameStatusEnum.PAUSED
    pause()
  }

  function unpauseGame() {
    game.value.status = GameStatusEnum.PLAYING
    resume()
  }

  function tick() {
    if (game.value.status === GameStatusEnum.PLAYING) {
      tickCounter.value++
      each(usePlayerStore().getPlayers, (player: Player) => {
        switch (player.status) {
          case PlayerStatusEnum.playing:
            player.playingSeconds++
            break;
          case PlayerStatusEnum.benching:
            player.benchingSeconds++
            break;
          case PlayerStatusEnum.goaling:
            player.goalingSeconds++
            break;
        }
      })
    }
  }

  function recalculateStats() {
    if (game.value.status === GameStatusEnum.PLAYING) {
      each(usePlayerStore().getPlayers, (player: Player) => {
        switch (player.status) {
          case PlayerStatusEnum.playing:
            player.playingSeconds = getFieldDurationFromPlayerTimerEvents(
                filter(
                    useEventStore().getEvents,
                    (event: Event) => event.references.playerUuid === null
                                        || event.references.playerUuid === player.uuid
                ),
                new Date()
            )
            break;
          case PlayerStatusEnum.benching:
            player.benchingSeconds = getBenchingDurationFromPlayerTimerEvents(
                filter(
                    useEventStore().getEvents,
                    (event: Event) => event.references.playerUuid === null
                        || event.references.playerUuid === player.uuid
                ),
                new Date()
            )
            break;
          case PlayerStatusEnum.goaling:
            player.goalingSeconds = getGoalingDurationFromPlayerTimerEvents(
                filter(
                    useEventStore().getEvents,
                    (event: Event) => event.references.playerUuid === null
                        || event.references.playerUuid === player.uuid
                ),
                new Date()
            )
            break;
        }
      })
    }
  }

  return {
    tickCounter,
    isTimerRunning,
    getGame,
    startGame,
    pauseGame,
    unpauseGame,
    resetGame
  }
})


