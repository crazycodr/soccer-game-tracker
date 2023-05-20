<script setup lang="ts">

import {useGameStore} from "@/stores/GameStore";
import {useEventStore} from "@/stores/EventStore";
import {ref} from "vue";
import {useTimeout} from "@vueuse/core";
import {useI18n} from "vue-i18n";

const {t} = useI18n({
  messages: {
    en: {
      gameDataTitle: "Reset data",
      gameAndPlayerStatusOption: "Game and player status",
      gameAndPlayerTimersOption: "Game and player timers",
      playerGoalsAndPassesOption: "Player goals and passes",
      logEventsOption: "Event log",
      resetAction: "Reset",
      resetConfirmation: "Data has been reset!"
    },
    fr: {
      gameDataTitle: "Effacer les données",
      gameAndPlayerStatusOption: "Statuts de la partie et des joueurs",
      gameAndPlayerTimersOption: "Temps de la partie et des joueurs",
      playerGoalsAndPassesOption: "Buts et passes des joueurs",
      logEventsOption: "Journal d'évènement",
      resetAction: "Effacer",
      resetConfirmation: "Les données sont effacées!"
    }
  }
})

const resetStatusFlag = ref(false);
const resetTimersFlag = ref(false);
const resetGoalsAndPassesFlag = ref(false);
const resetEventLogFlag = ref(false);
const showSuccess = ref(false);

const { start: startSuccessTimeout } = useTimeout(5000, { controls: true, callback: hideSuccessTimeout });

const { resetStatuses, resetTimers, resetGoals, resetPasses } = useGameStore();
const { resetEvents } = useEventStore();

function resetAndPause() {
  if (resetStatusFlag.value) {
    resetStatuses()
  }
  if (resetTimersFlag.value) {
    resetTimers()
  }
  if (resetGoalsAndPassesFlag.value) {
    resetGoals()
    resetPasses()
  }
  if (resetEventLogFlag.value) {
    resetEvents()
  }
  resetStatusFlag.value = false
  resetTimersFlag.value = false
  resetGoalsAndPassesFlag.value = false
  resetEventLogFlag.value = false
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
      <el-checkbox label="goals" v-model="resetGoalsAndPassesFlag">{{ t('playerGoalsAndPassesOption') }}</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-checkbox label="passes" v-model="resetEventLogFlag">{{ t('logEventsOption') }}</el-checkbox>
    </el-row>
    <el-row class="reset-option">
      <el-button
          class="reset"
          :disabled="!(resetStatusFlag || resetTimersFlag || resetGoalsAndPassesFlag || resetEventLogFlag)"
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