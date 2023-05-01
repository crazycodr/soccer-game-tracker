<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "@/stores/game";

const {unbenchPlayer, benchPlayer, increaseGoals, increasePasses} = useGameStore();

const props = defineProps(['name', 'status', 'gameSeconds', 'benchSeconds', 'goals', 'passes'])

const readableTimeSince = computed(() => {
  let referenceSeconds = 0
  if (props.status === 'playing') {
    referenceSeconds = props.gameSeconds
  } else {
    referenceSeconds = props.benchSeconds
  }
  const seconds = Math.floor(referenceSeconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(referenceSeconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const isPlaying = computed(() => {
  return props.status === 'playing'
})

const isBenching = computed(() => {
  return props.status === 'benching'
})
</script>
<template>
  <main>
    <div class="team-player">
      <div class="player-name">{{ name }}</div>
      <div class="player-status">
        <div :class="{status: true, playing: isPlaying, benching: isBenching}">
          {{ status }} ({{readableTimeSince}})
        </div>
        <input type="button" value="Bench" v-if="isPlaying" @click="benchPlayer(name)"/>
        <input type="button" value="Play" v-if="isBenching" @click="unbenchPlayer(name)" />
      </div>
      <div class="player-score">
        <input type="button" :value="goals" @click="increaseGoals(name)" />
        <span>/</span>
        <input type="button" :value="passes" @click="increasePasses(name)" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.team-player {
  padding: 1em;
  border: 1px solid black;
  margin-bottom: 1em;
}
.player-name {
  font-size: 1.5em;
  margin-bottom: 0.5em;
  text-align: center;
}
.player-status {
}
.player-status .status {
  padding: 0.5em;
  text-align: center;
  text-transform: capitalize;
}
.player-status .status.playing {
  color: green;
}
.player-status .status.benching {
  color: red;
}
.player-status input {
  width: 100%;
  height: 4em;
  margin-bottom: 1em;
  white-space: normal;
}
.player-score {
  text-align: center;
}
.player-score span {
  font-size: 1.5em;
  margin: 0 0.5em;
}
.player-score input {
  font-size: 1.5em;
}
</style>