<script setup lang="ts">

import {ref} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n({
  messages: {
    en: {
      cancelOption: "Cancel",
      nameLabel: "Team name",
      color: "Color",
      updateOption: "Update",
      createOption: "Create"
    },
    fr: {
      cancelOption: "Annuler",
      nameLabel: "Nom de l'équipe",
      color: "Couleur",
      updateOption: "Mettre à jour",
      createOption: "Créer"
    }
  }
})

const emit = defineEmits< {
  (e: 'submit', payload: {name: string, color: string}): void,
  (e: 'cancel'): void,
  (e: 'delete'): void
}>()

const props = defineProps({
  canDelete: { type: Boolean, default: false },
  initialName: { type: String, default: '' },
  initialColor: { type: String, default: '' }
})

const editedName = ref(props.initialName)
const editedColor = ref(props.initialColor)

function submitOnEnter(key: KeyboardEvent) {
  if (key.key === 'Enter') {
    emitSubmit()
  }
}

function emitSubmit() {
  emit('submit', {
    name: editedName.value,
    color: editedColor.value
  })
}

function emitCancel() {
  emit('cancel')
}

function emitDelete() {
  emit('delete')
}
</script>
<template>
  <el-form label-position="top" @submit.prevent="emitSubmit">
    <el-form-item @keyup="submitOnEnter" :label="t('nameLabel')">
      <el-input v-model="editedName" />
    </el-form-item>
    <el-form-item :label="t('color')">
      <el-color-picker v-model="editedColor" />
    </el-form-item>
    <el-form-item>
      <el-button icon="RemoveFilled" v-if="canDelete" type="danger" @click="emitDelete" />
      <el-button class="push-right" @click="emitCancel">{{ t('cancelOption') }}</el-button>
      <el-button type="primary" @click="emitSubmit">{{ canDelete ? t('updateOption') : t('createOption') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.push-right {
  margin-left: auto;
}
</style>