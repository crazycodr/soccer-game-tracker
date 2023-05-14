<script setup lang="ts">

import {usePlayerStore} from "@/stores/PlayerStore"
import {ElMessageBox, ElNotification} from "element-plus"
import {ref} from "vue"
import {useI18n} from "vue-i18n"
import PlayerEditor from "@/components/PlayerEditor.vue";
import {useRegistryStore} from "@/stores/RegistryStore";
import type {Player} from "@/stores/models/Player";

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Player to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete",
      modalTitle: "Edit player",
      notificationTitle: "Success",
      notificationMessage: "Player added or updated in registry"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Joueur à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer",
      modalTitle: "Modifier le joueur",
      notificationTitle: "Succès",
      notificationMessage: "Joueur ajouté ou mise à jour dans le registre"
    }
  }
})

const {removePlayerByUuid, updatePlayer, getPlayerByUuid} = usePlayerStore()
const {upsertPlayerInRegistry} = useRegistryStore()

const props = defineProps(['uuid', 'name', 'inTeam', 'jacketNumber'])

const showDialog = ref(false)

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
      <div class="name">
        {{name}}
        <span v-if="jacketNumber !== ''"> (#{{jacketNumber}})</span>
      </div>
    </template>
    <template #default>
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
    </template>
  </el-card>
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
    flex-basis: 66%;
    font-size: 1.2em;
    text-transform: capitalize;
  }

  .push-right {
    margin-left: auto;
  }
}
</style>