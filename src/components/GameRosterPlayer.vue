<script setup lang="ts">
import {computed} from "vue";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useGameStore} from "@/stores/GameStore";

const {unbenchPlayer, benchPlayer, increaseGoals, increasePasses, decreasePasses, decreaseGoals} = usePlayerStore();
const {inAdditionMode, inRemovalMode} = useGameStore();

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

function affectGoals(name: string) {
  if (inAdditionMode) {
    increaseGoals(name)
  }
  if (inRemovalMode) {
    decreaseGoals(name)
  }
}

function affectPasses(name: string) {
  if (inAdditionMode) {
    increasePasses(name)
  }
  if (inRemovalMode) {
    decreasePasses(name)
  }
}
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
          <el-button @click="affectGoals(name)">{{goals}}</el-button>
          <span>/</span>
          <el-button @click="affectPasses(name)">{{passes}}</el-button>
        </div>
        <div class="player-status">
          <el-button v-if="isPlaying" @click="benchPlayer(name)">Bench</el-button>
          <el-button v-if="isBenching" @click="unbenchPlayer(name)">Play</el-button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.team-player {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 2px dotted lightgrey;
  padding: 0.5em;
  margin: 0.5em -0.5em;
  background-color: #f7f7f7;

  .left-col {
    flex-grow: 2;
    margin-right: 1em;

    .player-name {
      font-size: 1.5em;
      border-bottom: 1px solid lightgrey;
      margin-bottom: 0.5em;
    }

    .status {
      display: flex;
      justify-content: space-between;
      color: darkgrey;

      &.playing {
        color: green;
      }

      &.benching {
        color: red;
      }
    }
  }

  .right-col {
    flex-grow: 1;

    .player-status {
    }

    .player-status .status {
      padding: 0.5em;
      text-align: center;
      text-transform: capitalize;
    }

    .player-status > * {
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
  }
}
</style>