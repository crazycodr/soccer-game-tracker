<script setup lang="ts">
import GameConfigPlayer from "@/components/GameConfigPlayer.vue"
import GameConfigPlayerCreator from "@/components/GameConfigPlayerCreator.vue"
import {storeToRefs} from "pinia";
import GameConfigTeamCreator from "@/components/GameConfigTeamCreator.vue";
import GameConfigTeam from "@/components/GameConfigTeam.vue";
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
      <div v-for="team in getTeams" :key="team.name">
        <GameConfigTeam :name="team.name" :color="team.color" />
      </div>
    </div>
    <div class="player-config">
      <div class="section-header">
        <h2>{{ t('playersTitle') }}</h2>
        <GameConfigPlayerCreator class="creator" />
      </div>
      <div v-for="player in getPlayers" :key="player.uuid">
        <GameConfigPlayer :uuid="player.uuid" :name="player.name" :in-team="player.team" />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.config-view {
  margin-bottom: 25em;

  .team-config, .player-config {
    margin-bottom: 2em;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>