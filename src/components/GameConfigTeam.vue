<script setup lang="ts">
import {useTeamStore} from "@/stores/TeamStore";
import {computed} from "vue";
import {ElColorPicker, ElMessageBox} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Team to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Équipe à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer"
    }
  }
})

const {removeTeamByName, setTeamColor} = useTeamStore();

const props = defineProps(['name', 'color'])

const selectedColor = computed({
  get() {
    return props.color
  },
  set(value: string) {
    setTeamColor(props.name, value)
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
    removeTeamByName(props.name)
  }).catch(() => {
    // Do nothing
  })
}
</script>

<template>
  <main class="config-team">
    <div class="name">{{name}}</div>
    <el-color-picker v-model="selectedColor" />
    <el-button icon="RemoveFilled" @click="confirmDeletion">{{ t('deleteOption') }}</el-button>
  </main>
</template>

<style scoped lang="scss">
.config-team {
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
    flex-basis: 50%;
    font-size: 1.2em;
    text-transform: capitalize;
  }
}
</style>