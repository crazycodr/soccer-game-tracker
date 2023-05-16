<script setup lang="ts">
import {storeToRefs} from "pinia";
import {filter, map, sum} from "lodash";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import type {Player} from "@/stores/models/Player";

const {getPlayers} = storeToRefs(usePlayerStore());
const {getTeams} = storeToRefs(useTeamStore());

function getGoalsOfTeam(teamUuid: string) {
  const players = filter(getPlayers.value, (player: Player) => {
    return player.team === teamUuid
  })
  return sum(map(players, 'goals'))
}
</script>

<template>
  <main>
    <div class="scores">
      <div class="score" v-for="team in getTeams" :key="team.uuid" :style="{'border-color': team.color}">
        <div class="team-name" :style="{'color': team.color}">
          {{ team.name }}
        </div>
        <div class="team-score">
          {{ getGoalsOfTeam(team.uuid) }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.scores {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;

  .score {
    text-align: center;
    border: 3px solid gray;
    padding: 0.5em 1.5em;
    flex-basis: 40%;
    margin-bottom: 1em;

    .team-name {
      text-transform: capitalize;
      font-size: 1.5em;
    }

    .team-score {
      font-size: 3em;
    }
  }
}
</style>