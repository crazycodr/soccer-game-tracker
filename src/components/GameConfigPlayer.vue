<script setup lang="ts">

import {storeToRefs} from "pinia";
import {useTeamStore} from "@/stores/TeamStore";
import {usePlayerStore} from "@/stores/PlayerStore";
import {ElMessageBox} from "element-plus";
import {computed} from "vue";

const {getTeams} = storeToRefs(useTeamStore());
const {setPlayerTeam, removePlayerByName} = usePlayerStore();

const props = defineProps(['name', 'inTeam'])

const selectedTeam = computed({
  get: () => {
    return props.inTeam
  },
  set(value: string) {
    setPlayerTeam(props.name, value)
  }
})

const confirmDeletion = () => {
  ElMessageBox.confirm(
      `Player to be deleted: ${props.name}`,
      'Confirm deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
  ).then(() => {
    removePlayerByName(props.name)
  })
}
</script>

<template>
  <main class="game-config-player">
    <div class="name">{{name}}</div>
    <el-select class="team" v-model="selectedTeam">
      <el-option
          v-for="team in getTeams"
          :key="team.name"
          :value="team.name">{{team.name}}</el-option>
    </el-select>
    <el-button icon="RemoveFilled" @click="confirmDeletion">Delete</el-button>
  </main>
</template>

<style scoped lang="scss">
.game-config-player {
  padding: 0.5em;
  margin-top: 0.5em;
  margin-left: -0.5em;
  margin-right: -0.5em;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  border-bottom: 2px dotted lightgrey;

  .name {
    flex-basis: 33%;
    font-size: 1.2em;
    text-transform: capitalize;
  }

  .team {
    flex-basis: 33%;
  }
}
</style>