<script setup lang="ts">
import GameConfigPlayerEditor from "@/components/GameConfigPlayerEditor.vue"
import GameConfigPlayerCreator from "@/components/GameConfigPlayerCreator.vue"
import {storeToRefs} from "pinia";
import GameConfigTeamCreator from "@/components/GameConfigTeamCreator.vue";
import GameConfigTeam from "@/components/GameConfigTeamEditor.vue";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import {useI18n} from 'vue-i18n'

const {t} = useI18n({
  messages: {
    en: {
      teamsTitle: "Teams",
      playersTitle: "Players"
    },
    fr: {
      teamsTitle: "Équipes",
      playersTitle: "Joueurs"
    }
  }
})

const {getTeams} = storeToRefs(useTeamStore());
const {getPlayers} = storeToRefs(usePlayerStore());

</script>

<template>
  <main class="config-view">
    <div class="team-config">
      <div class="section-header">
        <h2>{{ t('teamsTitle') }}</h2>
        <GameConfigTeamCreator class="creator" />
      </div>
      <div v-for="team in getTeams" :key="team.uuid">
        <GameConfigTeam :uuid="team.uuid" :name="team.name" :color="team.color" />
      </div>
    </div>
    <div class="player-config">
      <div class="section-header">
        <h2>{{ t('playersTitle') }}</h2>
        <GameConfigPlayerCreator class="creator" />
      </div>
      <el-row gutter="10">
        <el-col :xs="12"
                v-for="player in getPlayers"
                :key="player.uuid">
          <GameConfigPlayerEditor class="player-entry"
                                  :uuid="player.uuid"
                                  :name="player.name"
                                  :in-team="player.team"
                                  :jacket-number="player.jacketNumber" />
        </el-col>
      </el-row>
    </div>
  </main>
</template>

<style scoped lang="scss">
.config-view {
  margin-bottom: 25em;

  h2 {
    margin-bottom: 1em;
  }

  .team-config, .player-config {
    margin-bottom: 2em;
  }

  .player-entry {
    margin-bottom: 10px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>