<script setup lang="ts">

import {storeToRefs} from "pinia"
import {useTeamStore} from "@/stores/TeamStore"
import {usePlayerStore} from "@/stores/PlayerStore"
import {ElMessageBox} from "element-plus"
import {computed, ref} from "vue"
import {useI18n} from "vue-i18n"
import type {Team} from "@/stores/models/Team";
import {find} from "lodash";
import PlayerEditor from "@/components/PlayerEditor.vue";

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Player to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete",
      modalTitle: "Edit player"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Joueur à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer",
      modalTitle: "Modifier le joueur"
    }
  }
})

const {getTeams} = storeToRefs(useTeamStore())
const {setPlayerTeam, removePlayerByUuid, updatePlayer} = usePlayerStore()

const props = defineProps(['uuid', 'name', 'inTeam', 'jacketNumber'])

const showDialog = ref(false)

const selectedTeam = computed({
  get(){
    return find(getTeams.value, (team: Team) => {
      return team.uuid === props.inTeam
    })
  },
  set(team){
    setPlayerTeam(props.uuid, team ? team.uuid : '')
  }
})

function update(payload: {name: string, team: string, jacketNumber: string}) {
  updatePlayer(props.uuid, payload.name, payload.team, payload.jacketNumber)
  showDialog.value = false
}

const confirmDeletion = () => {
  ElMessageBox.confirm(
      t('confirmMessage', {name: props.name}),
      t('confirmTitle'),
      {
        confirmButtonText: t('deleteOption'),
        cancelButtonText: t('cancelOption')
      }
  ).then(() => {
    removePlayerByUuid(props.uuid)
  }).catch(() => {
    // Do nothing
  })
}
</script>

<template>
  <main class="game-config-player">
    <div class="name">
      {{name}}
      <span v-if="jacketNumber !== ''"> (#{{jacketNumber}})</span>
    </div>
    <el-select class="team" v-model="selectedTeam" value-key="uuid">
      <el-option
          v-for="team in getTeams"
          :key="team.uuid"
          :value="team" :label="team.name" />
    </el-select>
    <el-button icon="EditPen" @click="showDialog = true" />

    <el-dialog v-model="showDialog" width="90%" :title="t('modalTitle')" @close="showDialog = false">
      <player-editor
          :initial-name="name"
          :initial-team="inTeam"
          :initial-jacket-number="jacketNumber"
          :can-delete="true"
          @submit="update"
          @cancel="showDialog = false"
          @delete="confirmDeletion" />
    </el-dialog>

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

  .push-right {
    margin-left: auto;
  }
}
</style>