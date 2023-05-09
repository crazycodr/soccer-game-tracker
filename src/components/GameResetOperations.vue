<script setup lang="ts">

import {useGameStore} from "@/stores/GameStore";
import {ref} from "vue";
import {useTimeout} from "@vueuse/core";
import {useI18n} from "vue-i18n";

const {t} = useI18n({
  messages: {
    en: {
      gameDataTitle: "Reset data",
      gameAndPlayerStatusOption: "Game and player status",
      gameAndPlayerTimersOption: "Game and player timers",
      playerGoalsOption: "Player goals",
      playerPassesOption: "Player passes",
      resetAction: "Reset",
      resetConfirmation: "Data has been reset!"
    },
    fr: {
      gameDataTitle: "Effacer les données",
      gameAndPlayerStatusOption: "Statuts de la partie et des joueurs",
      gameAndPlayerTimersOption: "Temps de la partie et des joueurs",
      playerGoalsOption: "Buts des joueurs",
      playerPassesOption: "Passes des joueurs",
      resetAction: "Effacer",
      resetConfirmation: "Les données sont effacées!"
    }
  }
})

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
    <h2>{{ t('gameDataTitle') }}</h2>
    <el-row class="reset-option">
      <el-checkbox label="statuses" v-model="resetStatusFlag">{{ t('gameAndPlayerStatusOption') }}</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="timers" v-model="resetTimersFlag">{{ t('gameAndPlayerTimersOption') }}</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="goals" v-model="resetGoalsFlag">{{ t('playerGoalsOption') }}</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="passes" v-model="resetPassesFlag">{{ t('playerPassesOption') }}</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-button
          class="reset"
          :disabled="!(resetStatusFlag || resetTimersFlag || resetGoalsFlag || resetPassesFlag)"
          @click.stop="resetAndPause">{{ t('resetAction') }}</el-button>
    </el-row>
    <el-alert type="success" v-if="showSuccess">
      {{ t('resetConfirmation') }}
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