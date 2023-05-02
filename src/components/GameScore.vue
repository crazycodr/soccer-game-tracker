<script setup lang="ts">
import {storeToRefs} from "pinia";
import {filter, map, sum} from "lodash";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import {Player} from "@/stores/models/Player";

const {getPlayers} = storeToRefs(usePlayerStore());
const {getTeams} = storeToRefs(useTeamStore());

function getGoalsOfTeam(teamName: string) {
  const players = filter(getPlayers.value, (player: Player) => {
    return player.team === teamName
  })
  return sum(map(players, 'goals'))
}
</script>

<template>
  <main>
    <div class="scores">
      <div class="score" v-for="team in getTeams" :key="team.name">
        <div class="team-name">
          {{ team.name }}
        </div>
        <div class="team-score">
          {{ getGoalsOfTeam(team.name) }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.scores {
  display: flex;
  justify-content: space-evenly;
}
.score {
  text-align: center;
  border: 1px dotted gray;
  padding: 0.5em 1.5em;
}
.team-name {
  text-transform: capitalize;
  font-size: 1.5em;
}
.team-score {
  font-size: 3em;
}
</style>