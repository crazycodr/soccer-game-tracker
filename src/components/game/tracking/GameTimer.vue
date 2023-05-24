<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "@/stores/GameStore";
import {storeToRefs} from "pinia";
import {formatTimeFromSeconds} from "@/modules/time/TimeFormatting";
import {useEventStore} from "@/stores/EventStore";
import {filter} from "lodash";
import {EventEnum, Event} from "@/stores/models/Event";
import {getGameDurationFromGameTimerEvents} from "@/modules/time/TimeCalculation";

const {pauseGame, unpauseGame} = useGameStore();
const {startTimer, stopTimer} = useEventStore();
const {getEvents} = storeToRefs(useEventStore());

const {getGame, tickCounter} = storeToRefs(useGameStore());

const formattedTime = computed(() => {
  const gameTimerEvents = filter(getEvents.value, (event: Event) => {
    return event.type === EventEnum.GAME_TIMER_START || event.type === EventEnum.GAME_TIMER_STOP
  })
  const secondsBeforeCurrentEvent = getGameDurationFromGameTimerEvents(gameTimerEvents, new Date())
  /**
   * This strange +/- tickCounter is to stimulate redraw of the property because it is event based
   * and would not change on tick.
   */
  return formatTimeFromSeconds(secondsBeforeCurrentEvent + tickCounter.value - tickCounter.value)
})

function timerPress() {
  if (getGame.value.status === 'playing') {
    pauseGame()
    stopTimer(new Date())
  } else {
    unpauseGame()
    startTimer(new Date())
  }
}

const timerClasses = computed(() => {
  return {
    timer: true,
    playing: getGame.value.status === 'playing'
  }
})
</script>

<template>
  <main>
    <div :class="timerClasses" @click="timerPress">
      {{ formattedTime }}
    </div>
  </main>
</template>

<style scoped lang="scss">
.timer {
  text-align: center;
  font-size: 3em;
  margin-bottom: 1em;
  border: 1px solid red;
  background-color: rgba(255, 0, 0, 0.2);

  &.playing {
    border: 1px solid green;
    background-color: rgba(0, 255, 0, 0.2)
  }
}
</style>