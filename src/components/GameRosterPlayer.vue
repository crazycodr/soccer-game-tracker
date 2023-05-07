<script setup lang="ts">
import {computed} from "vue";
import {usePlayerStore} from "@/stores/PlayerStore";

const {unbenchPlayer, benchPlayer, increaseGoals, increasePasses} = usePlayerStore();

const props = defineProps(['name', 'status', 'gameSeconds', 'benchSeconds', 'goals', 'passes'])

const benchTimeSince = computed(() => {
  let referenceSeconds = props.benchSeconds
  const seconds = Math.floor(referenceSeconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(referenceSeconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const playingTimeSince = computed(() => {
  let referenceSeconds = props.gameSeconds
  const seconds = Math.floor(referenceSeconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(referenceSeconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const playingStatus = computed(() => {
  return isPlaying.value ? 'Playing' : 'Played'
})

const benchingStatus = computed(() => {
  return isBenching.value ? 'Benching' : 'Benched'
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
      <div class="left-col">
        <div class="player-name">{{ name }}</div>
        <div :class="{status: true, playing: isPlaying}">
          <div class="label">{{ playingStatus }}</div>
          <div class="timer">{{ playingTimeSince }}</div>
        </div>
        <div :class="{status: true, benching: isBenching}">
          <div class="label">{{ benchingStatus }}</div>
          <div class="timer">{{ benchTimeSince }}</div>
        </div>
      </div>
      <div class="right-col">
        <div class="player-score">
          <el-button @click="increaseGoals(name)">{{goals}}</el-button>
          <span>/</span>
          <el-button @click="increasePasses(name)">{{passes}}</el-button>
        </div>
        <div class="player-status">
          <el-button v-if="isPlaying" @click="benchPlayer(name)">Bench</el-button>
          <el-button v-if="isBenching" @click="unbenchPlayer(name)">Play</el-button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.team-player {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1em;
  border-bottom: 1px dotted grey;
  margin-bottom: 1em;
}
.left-col {
  flex-grow: 2;
  margin-right: 1em;
}
.right-col {
  flex-grow: 1;
}
.player-name {
  font-size: 1.5em;
  border-bottom: 1px solid grey;
  margin-bottom: 0.5em;
}
.player-status {
}
.player-status .status {
  padding: 0.5em;
  text-align: center;
  text-transform: capitalize;
}
.status {
  display: flex;
  justify-content: space-between;
  color: darkgrey;
}
.status.playing {
  color: green;
}
.status.benching {
  color: red;
}
.player-status .el-button {
  width: 100%;
  height: 4em;
  margin-bottom: 1em;
  white-space: normal;
}
.player-score {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5em;
}
.player-score span {
  font-size: 1.5em;
  margin: 0 0.5em;
}
.player-score input {
  font-size: 1.5em;
}
</style>