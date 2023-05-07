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
  <main class="confing-view">
    <div class="team-config">
      <h2>Teams</h2>
      <GameConfigTeamCreator />
      <div v-for="team in getTeams" :key="team.name">
        <GameConfigTeam :name="team.name" :color="team.color" />
      </div>
    </div>

    <div class="player-config">
      <h2>Players</h2>
      <GameConfigPlayerCreator />
      <div v-for="player in getPlayers" :key="player.name">
        <GameConfigPlayer :name="player.name" :in-team="player.team" />
      </div>
    </div>

  </main>
</template>

<style scoped>
.confing-view {
  margin-bottom: 25em;
}
.team-config {
  margin-bottom: 2em;
}
.player-config {
  margin-bottom: 2em;
}
</style>