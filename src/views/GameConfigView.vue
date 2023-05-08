<script setup lang="ts">
import GameConfigPlayer from "@/components/GameConfigPlayer.vue"
import GameConfigPlayerCreator from "@/components/GameConfigPlayerCreator.vue"
import {storeToRefs} from "pinia";
import GameConfigTeamCreator from "@/components/GameConfigTeamCreator.vue";
import GameConfigTeam from "@/components/GameConfigTeam.vue";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";

const {getTeams} = storeToRefs(useTeamStore());
const {getPlayers} = storeToRefs(usePlayerStore());

</script>

<template>
  <main class="config-view">
    <div class="team-config">
      <div class="section-header">
        <h2>Teams</h2>
        <GameConfigTeamCreator class="creator" />
      </div>
      <div v-for="team in getTeams" :key="team.name">
        <GameConfigTeam :name="team.name" :color="team.color" />
      </div>
    </div>

    <div class="player-config">
      <div class="section-header">
        <h2>Players</h2>
        <GameConfigPlayerCreator class="creator" />
      </div>
      <div v-for="player in getPlayers" :key="player.name">
        <GameConfigPlayer :name="player.name" :in-team="player.team" />
      </div>
    </div>

  </main>
</template>

<style scoped>
.config-view {
  margin-bottom: 25em;
}
.team-config {
  margin-bottom: 2em;
}
.player-config {
  margin-bottom: 2em;
}
.section-header {
  display: flex;
  justify-content: space-between;
}
</style>