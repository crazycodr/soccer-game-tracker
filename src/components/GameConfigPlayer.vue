<script setup lang="ts">

import {storeToRefs} from "pinia"
import {useTeamStore} from "@/stores/TeamStore"
import {usePlayerStore} from "@/stores/PlayerStore"
import {ElMessageBox} from "element-plus"
import {computed} from "vue"
import {useI18n} from "vue-i18n"

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Player to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Joueur à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer"
    }
  }
})

const {getTeams} = storeToRefs(useTeamStore())
const {setPlayerTeam, removePlayerByName} = usePlayerStore()

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
      t('confirmMessage', {name: props.name}),
      t('confirmTitle'),
      {
        confirmButtonText: t('deleteOption'),
        cancelButtonText: t('cancelOption')
      }
  ).then(() => {
    removePlayerByName(props.name)
  }).catch(() => {
    // Do nothing
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
    <el-button icon="RemoveFilled" @click="confirmDeletion">{{ t('deleteOption') }}</el-button>
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