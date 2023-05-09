<script setup lang="ts">
import GameRosterPlayer from "@/components/GameRosterPlayer.vue";
import {storeToRefs} from "pinia";
import {filter} from "lodash";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import type {Player} from "@/stores/models/Player";

const {getPlayers} = storeToRefs(usePlayerStore());
const {getTeams} = storeToRefs(useTeamStore());

function getPlayersOfTeam(teamName: string) {
  return filter(getPlayers.value, (player: Player) => {
    return player.team === teamName
  })
}
</script>

<template>
  <main>
    <div class="team" v-for="team in getTeams" :key="team.name">
      <div class="team-name" :style="{color: team.color, 'border-bottom-color': team.color}">{{ team.name }}</div>
      <div class="team-roster">
        <GameRosterPlayer v-for="player in getPlayersOfTeam(team.name)"
                          :key="player.uuid"
                          :uuid="player.uuid"
                          :name="player.name"
                          :status="player.status"
                          :game-seconds="player.gameSeconds"
                          :bench-seconds="player.benchSeconds"
                          :goals="player.goals"
                          :passes="player.passes" />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.team {
  margin-top: 2em;

  .team-name {
    font-size: 2em;
    display: block;
    border-bottom: 2px solid black;
    margin-bottom: 0.5em;
  }

  .team-roster {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
}
</style>