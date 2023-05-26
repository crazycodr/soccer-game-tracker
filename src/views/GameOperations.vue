<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/stores/OptionStore";
import {storeToRefs} from "pinia";
import RosterSetup from "@/views/RosterSetup.vue";
import {useTeamStore} from "@/stores/TeamStore";
import GameStarter from "@/views/GameStarter.vue";
import {useGameStore} from "@/stores/GameStore";
import {GameStatusEnum} from "@/stores/models/Game";
import GoalReport from "@/views/GoalReport.vue";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      title: "Operations"
    },
    fr: {
      title: "Opérations"
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value
</script>

<template>
  <main>
    <h1 class="section-title">{{ t('title') }}</h1>
    <el-tabs>
      <el-tab-pane label="Game">
        <GameStarter v-if="useGameStore().getGame.status === GameStatusEnum.PRE_GAME" />
        <GoalReport v-if="useGameStore().getGame.status === GameStatusEnum.PLAYING" />
        <p v-if="useGameStore().getGame.status === GameStatusEnum.PAUSED">
          The game is currently paused, you cannot execute any operations on it at this moment.
        </p>
      </el-tab-pane>
      <el-tab-pane label="Rosters">
        <RosterSetup v-for="team in useTeamStore().getTeams" :key="team.uuid" :edited-team="team" />
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

