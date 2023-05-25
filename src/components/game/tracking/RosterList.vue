<script setup lang="ts">
import GameRosterPlayer from "@/components/game/tracking/PlayerEntry.vue";
import {storeToRefs} from "pinia";
import {filter, map, sortBy} from "lodash";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import type {Player} from "@/stores/models/Player";
import {TrackingSortOptions, useOptionStore} from "@/stores/OptionStore";
import {computed} from "vue";
import type {Team} from "@/stores/models/Team";

const {getTrackingSorting} = storeToRefs(useOptionStore())

const playersPerTeam = computed((): {team: Team, players: Player[]}[] => {
  const teams = useTeamStore().getTeams
  return map(teams, (team: Team) => {
    let sortingFunction;
    switch (getTrackingSorting.value) {
      case TrackingSortOptions.TRACKING_SORT_HIGHEST_BENCH:
        sortingFunction = (player: Player) => player.benchingSeconds * -1
        break;
      case TrackingSortOptions.TRACKING_SORT_JERSEY:
        sortingFunction = (player: Player) => player.jersey
        break;
      case TrackingSortOptions.TRACKING_SORT_NAME:
      default:
        sortingFunction = (player: Player) => player.name
        break;
    }
    const players = filter(usePlayerStore().getPlayers, (player: Player) => player.team === team.uuid)
    const sortedPlayers = sortBy(players, sortingFunction)
    return {
      team: team,
      players: sortedPlayers
    }
  })
})
</script>

<template>
  <main>
    <div class="team" v-for="teamAndPlayersEntry in playersPerTeam" :key="teamAndPlayersEntry.team.uuid">
      <div class="team-name" :style="{color: teamAndPlayersEntry.team.color, 'border-bottom-color': teamAndPlayersEntry.team.color}">{{ teamAndPlayersEntry.team.name }}</div>
      <div class="team-roster">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8"
              v-for="player in teamAndPlayersEntry.players"
              :key="player.uuid">
            <GameRosterPlayer
                class="roster-player"
                :uuid="player.uuid"
                :name="player.name"
                :status="player.status"
                :jersey="player.jersey"/>
          </el-col>
        </el-row>
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

  .roster-player {
    margin-bottom: 1em;
  }
}
</style>