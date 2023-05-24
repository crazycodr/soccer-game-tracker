<script setup lang="ts">
import {storeToRefs} from "pinia";
import {filter, map, sum} from "lodash";
import {useTeamStore} from "@/stores/TeamStore";
import {useEventStore} from "@/stores/EventStore";
import type {Event} from "@/stores/models/Event";
import {EventEnum} from "@/stores/models/Event";

const {getEvents} = storeToRefs(useEventStore());
const {getTeams} = storeToRefs(useTeamStore());

function getGoalsOfTeam(teamUuid: string) {
  const goalEvents = filter(getEvents.value, (event: Event) => {
    return event.references.teamUuid === teamUuid && (
        event.type === EventEnum.GOAL
        || event.type === EventEnum.REVERTED_GOAL
    )
  })
  return sum(map(goalEvents, (event: Event) => {
    switch (event.type) {
      case EventEnum.GOAL: return 1
      case EventEnum.REVERTED_GOAL: return -1
      default: return 0
    }
  }))
}
</script>

<template>
  <el-row class="scores" :gutter="30">
    <el-col
        :xs="12" :sm="6" :md="4" :lg="3" :xl="2"
        v-for="team in getTeams"
        class="score-container"
        :key="team.uuid">
      <div class="score"
           :style="{'border-color': team.color}">
        <div class="team-name" :style="{'color': team.color}">
          {{ team.name }}
        </div>
        <div class="team-score">
          {{ getGoalsOfTeam(team.uuid) }}
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.scores {

  .score-container {
    margin-bottom: 30px;

    .score {
      text-align: center;
      border: 3px solid gray;
      width: 10em;
      height: 10em;
      margin: 0 auto;

      .team-name {
        text-transform: capitalize;
        font-size: 1.5em;
      }

      .team-score {
        font-size: 3em;
      }
    }
  }
}
</style>