<script setup lang="ts">

import {storeToRefs} from "pinia";
import {useTeamStore} from "@/stores/TeamStore";
import {usePlayerStore} from "@/stores/PlayerStore";

const {getTeams} = storeToRefs(useTeamStore());
const {setPlayerTeam, removePlayerByName} = usePlayerStore();

const props = defineProps(['name', 'inTeam'])

function selectTeam(teamName: string) {
  setPlayerTeam(props.name, teamName)
}
</script>

<template>
  <main>
    <div class="info">
      <div class="name">{{name}}</div>
      <div class="commands">
        <el-button @click="() => removePlayerByName(name)">Delete</el-button>
      </div>
    </div>
    <div class="team-selector">
      <div v-for="team in getTeams" :key="team.name">
        <div :style="{'background-color': team.name === inTeam ? team.color : 'transparent'}"
             :class="{team: true, selected: team.name === inTeam}"
             @click="selectTeam(team.name)">
          {{team.name}}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: #f1f1f1;
  padding: 0.5em;
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.info .name {
  font-size: 1.2em;
  text-transform: capitalize;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.team-selector {
  display: flex;
  flex-direction: row;
}

.team {
  border: 1px solid black;
  padding: 0.5em;
  margin-right: 0.5em;
  text-transform: capitalize;
}

.team.selected {
  background-color: white;
  color: black;
}

.team:hover {
  cursor: pointer;
}
</style>