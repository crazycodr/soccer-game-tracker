<script setup lang="ts">
import {computed, ref} from "vue"
import {useTeamStore} from "@/stores/TeamStore";
import {Team} from "@/stores/models/Team";
import {ElButton, ElInput} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n({
  messages: {
    en: {
      modalTitle: "Create team",
      teamNamePlaceholder: "Team name",
      cancelOption: "Cancel",
      createOption: "Create",
      errorLabel: "Team name already exists!"
    },
    fr: {
      modalTitle: "Créer une équipe",
      teamNamePlaceholder: "Nom de l'équipe",
      cancelOption: "Annuler",
      createOption: "Créer",
      errorLabel: "Cette équipe existe déjà!"
    }
  }
})

const {addTeam} = useTeamStore();

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
    addTeam(new Team(name.value))
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
      <h3>{{ t('teamNamePlaceholder') }}</h3>
      <el-input @keyup="keyupHandler" v-model="name" :placeholder="t('teamNamePlaceholder')" />
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