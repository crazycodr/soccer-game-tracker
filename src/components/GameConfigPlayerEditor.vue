<script setup lang="ts">

import {storeToRefs} from "pinia"
import {useTeamStore} from "@/stores/TeamStore"
import {usePlayerStore} from "@/stores/PlayerStore"
import {ElMessageBox} from "element-plus"
import {computed, ref} from "vue"
import {useI18n} from "vue-i18n"
import {Team} from "@/stores/models/Team";
import {find} from "lodash";

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Player to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete",
      modalTitle: "Edit player",
      playerNamePlaceholder: "Player name",
      teamPlaceholder: "Team",
      updateOption: "Update"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Joueur à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer",
      modalTitle: "Modifier le joueur",
      playerNamePlaceholder: "Nom du joueur",
      teamPlaceholder: "Équipe",
      updateOption: "Mettre à jour"
    }
  }
})

const {getTeams} = storeToRefs(useTeamStore())
const {setPlayerTeam, removePlayerByUuid, updatePlayer} = usePlayerStore()

const props = defineProps(['uuid', 'name', 'inTeam'])

const editName = ref(props.name)
const editTeam = ref(props.inTeam)
const showDialog = ref(false)

const editSelectedTeam = computed({
  get(){
    return find(getTeams.value, (team: Team) => {
      return team.uuid === editTeam.value
    })
  },
  set(team){
    editTeam.value = team ? team.uuid : ''
  }
})

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

function keyupHandler(key: KeyboardEvent) {
  if (key.key === 'Enter') {
    update()
  }
}

const isEmpty = computed((): boolean => {
  return editName.value.trim() === ''
})

function update() {
  updatePlayer(props.uuid, editName.value, editTeam.value)
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
    <div class="name">{{name}}</div>
    <el-select class="team" v-model="selectedTeam" value-key="uuid">
      <el-option
          v-for="team in getTeams"
          :key="team.uuid"
          :value="team" :label="team.name" />
    </el-select>
    <el-button icon="EditPen" @click="showDialog = true" />
    <el-dialog v-model="showDialog" width="90%" :title="t('modalTitle')" @close="showDialog = false">
      <h3>{{ t('playerNamePlaceholder') }}</h3>
      <el-input @keyup="keyupHandler" v-model="editName" :placeholder="t('playerNamePlaceholder')" />
      <h3>{{ t('teamPlaceholder') }}</h3>
      <el-select v-model="editSelectedTeam" value-key="uuid">
        <el-option
            v-for="team in getTeams"
            :key="team.uuid"
            :value="team" :label="team.name" />
      </el-select>
      <template #footer>
        <div class="commands">
          <el-button style="justify-self: start" icon="RemoveFilled" type="danger" @click="confirmDeletion" />
          <el-button class="push-right" @click="showDialog = false">{{ t('cancelOption') }}</el-button>
          <el-button :disabled="isEmpty" type="primary" @click="update">{{ t('updateOption') }}</el-button>
        </div>
      </template>
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

  .commands {
    display: flex;
    justify-content: space-between;

    .push-right {
      margin-left: auto;
    }
  }
}
</style>