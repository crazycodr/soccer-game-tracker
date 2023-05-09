<script setup lang="ts">
import {computed, ref} from "vue"
import {usePlayerStore} from "@/stores/PlayerStore";
import {Player} from "@/stores/models/Player";
import {ElButton, ElDialog, ElInput} from "element-plus";
import {useI18n} from "vue-i18n";

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

const name = ref('')
const error = ref('')
const showDialog = ref(false)

function keyupHandler(key: KeyboardEvent) {
  error.value = ''
  if (key.key === 'Enter') {
    create()
  }
}

const isEmpty = computed((): boolean => {
  return name.value.trim() === ''
})

function create() {
  try {
    addPlayer(new Player(name.value))
    name.value = ''
    showDialog.value = false
  } catch (exception) {
    error.value = t("errorLabel")
  }
}
</script>

<template>
  <main>
    <el-dialog v-model="showDialog" width="90%" :title="t('modalTitle')" @close="showDialog = false">
      <h3>{{ t('playerNamePlaceholder') }}</h3>
      <el-input @keyup="keyupHandler" v-model="name" :placeholder="t('playerNamePlaceholder')" />
      <div class="error" v-if="error">
        {{error}}
      </div>
      <template #footer>
        <el-button @click="showDialog = false">{{ t('cancelOption') }}</el-button>
        <el-button :disabled="isEmpty" type="primary" @click="create">{{ t('createOption') }}</el-button>
      </template>
    </el-dialog>
    <el-button @click="showDialog = true" icon="CirclePlusFilled">{{ t('createOption') }}</el-button>
  </main>
</template>

<style scoped lang="scss">
.error {
  color: red;
}
</style>