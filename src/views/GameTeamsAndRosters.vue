<script setup lang="ts">
import GameConfigPlayerEditor from "@/components/game/teams-and-rosters/PlayerEntry.vue"
import GameConfigPlayerCreator from "@/components/game/teams-and-rosters/PlayerCreationHeader.vue"
import {storeToRefs} from "pinia";
import GameConfigTeamCreator from "@/components/game/teams-and-rosters/TeamCreationHeader.vue";
import GameConfigTeam from "@/components/game/teams-and-rosters/TeamEntry.vue";
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
      <el-row :gutter="10">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
                v-for="team in getTeams"
                :key="team.uuid">
          <GameConfigTeam class="team-entry"
                          :uuid="team.uuid"
                          :name="team.name"
                          :color="team.color" />
        </el-col>
      </el-row>
    </div>
    <div class="player-config">
      <div class="section-header">
        <h2>{{ t('playersTitle') }}</h2>
        <GameConfigPlayerCreator class="creator" />
      </div>
      <el-row :gutter="10">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
                v-for="player in getPlayers"
                :key="player.uuid">
          <GameConfigPlayerEditor class="player-entry"
                                  :uuid="player.uuid"
                                  :name="player.name"
                                  :in-team="player.team"
                                  :jersey="player.jersey" />
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

  .team-entry, .player-entry {
    margin-bottom: 10px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>