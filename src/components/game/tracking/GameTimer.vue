<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "@/stores/GameStore";
import {storeToRefs} from "pinia";
import formatTimeFromSeconds from "@/modules/time/TimeFormatting";

const {pauseGame, unpauseGame} = useGameStore();

const {getGame} = storeToRefs(useGameStore());

const formattedTime = computed(() => {
  return formatTimeFromSeconds(getGame.value.seconds)
})

function timerPress() {
  if (getGame.value.status === 'playing') {
    pauseGame()
  } else {
    unpauseGame()
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