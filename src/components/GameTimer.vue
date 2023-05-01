<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "@/stores/game";

const props = defineProps(['status', 'seconds'])

const {reset, pauseGame, unpauseGame} = useGameStore();

const formattedTime = computed(() => {
  const seconds = Math.floor(props.seconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(props.seconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const isPlaying = computed(() => {
  return props.status === 'playing'
})

function timerPress() {
  if (props.status === 'playing') {
    pauseGame()
  } else {
    unpauseGame()
  }
}

function resetAndPause() {
  pauseGame()
  reset()
}
</script>

<template>
  <main>
    <div :class="{timer: true, playing: isPlaying}" @click="timerPress">
      {{formattedTime}}
      <input type="button" value="Reset" class="reset" @click.stop="resetAndPause" />
    </div>
  </main>
</template>

<style scoped>
.timer {
  text-align: center;
  font-size: 3em;
  margin-bottom: 1em;
  border: 1px solid red;
  background-color: rgba(255, 0, 0, 0.2)
}
.timer.playing {
  border: 1px solid green;
  background-color: rgba(0, 255, 0, 0.2)
}
.reset {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}
</style>