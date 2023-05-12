<script setup lang="ts">
import {ref} from "vue"
import {usePlayerStore} from "@/stores/PlayerStore";
import {Player} from "@/stores/models/Player";
import {ElButton, ElDialog} from "element-plus";
import {useI18n} from "vue-i18n";
import PlayerEditor from "@/components/PlayerEditor.vue";

const {t} = useI18n({
  messages: {
    en: {
      modalTitle: "Create player",
      playerNamePlaceholder: "Player name",
      cancelOption: "Cancel",
      createOption: "Create",
      errorLabel: "Player name already exists!"
    },
    fr: {
      modalTitle: "Créer un joueur",
      playerNamePlaceholder: "Nom du joueur",
      cancelOption: "Annuler",
      createOption: "Créer",
      errorLabel: "Ce joueur existe déjà!"
    }
  }
})

const {addPlayer} = usePlayerStore();

const showDialog = ref(false)

function create(payload: {name: string, team: string, jacketNumber: string}) {
  const newPlayer = new Player(payload.name)
  newPlayer.jacketNumber = payload.jacketNumber
  newPlayer.team = payload.team
  addPlayer(newPlayer)
  showDialog.value = false
}
</script>

<template>
  <main>
    <el-dialog v-model="showDialog" width="90%" :title="t('modalTitle')" @close="showDialog = false">
      <player-editor
          :can-delete="false"
          @submit="create"
          @cancel="showDialog = false" />
    </el-dialog>
    <el-button @click="showDialog = true" icon="CirclePlusFilled" />
  </main>
</template>

<style scoped lang="scss">
.error {
  color: red;
}
</style>