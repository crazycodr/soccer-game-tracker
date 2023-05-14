<script setup lang="ts">

import {usePlayerStore} from "@/stores/PlayerStore"
import {RegistryPlayer} from "@/stores/models/RegistryPlayer";
import {useI18n} from "vue-i18n";
import type {PropType} from "vue";
import {storeToRefs} from "pinia";
import {useOptionStore} from "@/stores/OptionStore";
import {ElNotification} from "element-plus";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      addToGame: "Game",
      noJacketNumber: 'No jacket number',
      notificationTitle: "Success",
      notificationMessage: "Player added or updated in current game"
    },
    fr: {
      addToGame: "Partie",
      noJacketNumber: 'Pas de # de gilet',
      notificationTitle: "Succès",
      notificationMessage: "Joueur ajouté ou mis à jour dans la partie en cours"
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value

const {upsertRegistryPlayerInGame} = usePlayerStore()

const props = defineProps({
  registryPlayer: {
    type: Object as PropType<RegistryPlayer>,
    required: true
  }
})

function sendToPlayerToGame() {
  upsertRegistryPlayerInGame(props.registryPlayer)
  ElNotification({
    title: t('notificationTitle'),
    message: t('notificationMessage'),
    type: 'success',
    showClose: false
  })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="name">{{ props.registryPlayer.name }}</div>
    </template>
    <template #default>
      <div v-if="props.registryPlayer.jacketNumber">#{{ props.registryPlayer.jacketNumber }}</div>
      <div v-if="!props.registryPlayer.jacketNumber">{{ t('noJacketNumber') }}</div>
      <el-button icon="DArrowLeft" @click="sendToPlayerToGame">{{ t('addToGame') }}</el-button>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.name {
  font-size: 1.2em;
  text-transform: capitalize;
}
</style>