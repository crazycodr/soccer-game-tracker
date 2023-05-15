<script setup lang="ts">

import {usePlayerStore} from "@/stores/PlayerStore"
import {ElMessageBox, ElNotification} from "element-plus"
import {computed, ref} from "vue"
import {useI18n} from "vue-i18n"
import PlayerEditor from "@/components/game/teams-and-rosters/PlayerEditor.vue";
import {useRegistryStore} from "@/stores/RegistryStore";
import type {Player} from "@/stores/models/Player";
import {useTeamStore} from "@/stores/TeamStore";

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Player to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete",
      modalTitle: "Edit player",
      notificationTitle: "Success",
      notificationMessage: "Player added or updated in registry",
      numberLess: "Number-less"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Joueur à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer",
      modalTitle: "Modifier le joueur",
      notificationTitle: "Succès",
      notificationMessage: "Joueur ajouté ou mise à jour dans le registre",
      numberLess: "Sans numéro"
    }
  }
})

const {removePlayerByUuid, updatePlayer, getPlayerByUuid} = usePlayerStore()
const {getTeamByUuid} = useTeamStore()
const {upsertPlayerInRegistry} = useRegistryStore()

const props = defineProps(['uuid', 'name', 'inTeam', 'jacketNumber'])

const showDialog = ref(false)

const color = computed(() => {
  try {
    const team = getTeamByUuid(props.inTeam)
    return team.color
  } catch (ex) {
    return ''
  }
})

function update(payload: { name: string, team: string, jacketNumber: string }) {
  updatePlayer(props.uuid, payload.name, payload.team, payload.jacketNumber)
  showDialog.value = false
}

function sendToPlayerRegistry() {
  const player: Player = getPlayerByUuid(props.uuid)
  upsertPlayerInRegistry(player)
  ElNotification({
    title: t('notificationTitle'),
    message: t('notificationMessage'),
    type: 'success',
    showClose: false
  })
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
  <el-card>
    <template #header>
      <div v-if="color" class="color-pin" :style="{'background-color': color}" />
      {{name}}
    </template>
    <template #default>
      <el-row class="jacket-number">
        <div v-if="jacketNumber !== ''"> #{{jacketNumber}}</div>
        <div v-if="jacketNumber === ''"> {{ t('numberLess') }}</div>
      </el-row>
      <el-row>
        <el-button icon="EditPen" @click="showDialog = true" />
        <el-button icon="DArrowRight" @click="sendToPlayerRegistry"/>
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
      </el-row>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.color-pin {
  float: right;
  vertical-align: middle;
  width: 1em;
  height: 1em;
  margin-left: 1em;
  border-radius: 50%;
}
.jacket-number {
  margin-bottom: 1em;
}
</style>