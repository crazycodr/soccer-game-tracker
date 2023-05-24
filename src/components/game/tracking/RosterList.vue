<script setup lang="ts">
import GameRosterPlayer from "@/components/game/tracking/PlayerEntry.vue";
import {storeToRefs} from "pinia";
import {filter} from "lodash";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import type {Player} from "@/stores/models/Player";

const {getPlayers} = storeToRefs(usePlayerStore());
const {getTeams} = storeToRefs(useTeamStore());

function getPlayersOfTeam(teamUuid: string) {
  return filter(getPlayers.value, (player: Player) => {
    return player.team === teamUuid
  })
}
</script>

<template>
  <main>
    <div class="team" v-for="team in getTeams" :key="team.uuid">
      <div class="team-name" :style="{color: team.color, 'border-bottom-color': team.color}">{{ team.name }}</div>
      <div class="team-roster">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8"
              v-for="player in getPlayersOfTeam(team.uuid)"
              :key="player.uuid">
            <GameRosterPlayer
                class="roster-player"
                :uuid="player.uuid"
                :name="player.name"
                :status="player.status"
                :goals="player.goals"
                :passes="player.passes"
                :jacket-number="player.jacketNumber"/>
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