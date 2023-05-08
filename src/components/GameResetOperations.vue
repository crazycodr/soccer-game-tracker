<script setup lang="ts">

import {useGameStore} from "@/stores/GameStore";
import {ref} from "vue";
import {useTimeout} from "@vueuse/core";

const resetStatusFlag = ref(false);
const resetTimersFlag = ref(false);
const resetGoalsFlag = ref(false);
const resetPassesFlag = ref(false);
const showSuccess = ref(false);

const { start: startSuccessTimeout } = useTimeout(5000, { controls: true, callback: hideSuccessTimeout });

const { resetStatuses, resetTimers, resetGoals, resetPasses } = useGameStore();

function resetAndPause() {
  if (resetStatusFlag.value) {
    resetStatuses()
  }
  if (resetTimersFlag.value) {
    resetTimers()
  }
  if (resetGoalsFlag.value) {
    resetGoals()
  }
  if (resetPassesFlag.value) {
    resetPasses()
  }
  resetStatusFlag.value = false
  resetTimersFlag.value = false
  resetGoalsFlag.value = false
  resetPassesFlag.value = false
  startSuccessTimeout()
  showSuccess.value = true
}

function hideSuccessTimeout (){
  showSuccess.value = false
}
</script>

<template>
  <main>
    <h2>Game data</h2>
    <el-row class="reset-option">
      <el-checkbox label="statuses" v-model="resetStatusFlag">Game and player status (Play/Pause/Bench)</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="timers" v-model="resetTimersFlag">Game and player timers</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="goals" v-model="resetGoalsFlag">Player goals</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="passes" v-model="resetPassesFlag">Player passes</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-button class="reset" :disabled="!(resetStatusFlag || resetTimersFlag || resetGoalsFlag || resetPassesFlag)" @click.stop="resetAndPause">Reset</el-button>
    </el-row>
    <el-alert type="success" v-if="showSuccess">
      Data has been reset.
    </el-alert>
  </main>
</template>

<style scoped lang="scss">
h2 {
  margin-bottom: 0.5em;
}
.reset-option {
  margin-bottom: 1em;
}
</style>