<script setup lang="ts">
import {useTeamStore} from "@/stores/TeamStore";
import {computed, ref} from "vue";
import {ElColorPicker, ElMessageBox} from "element-plus";
import {useI18n} from "vue-i18n";
import TeamEditor from "@/components/game/teams-and-rosters/TeamEditor.vue";

const {t} = useI18n({
  messages: {
    en: {
      confirmTitle: "Confirm deletion",
      confirmMessage: "Team to be deleted: {name}",
      cancelOption: "Cancel",
      deleteOption: "Delete",
      modalTitle: "Edit team"
    },
    fr: {
      confirmTitle: "Confirmer la suppression",
      confirmMessage: "Équipe à supprimer: {name}",
      cancelOption: "Annuler",
      deleteOption: "Supprimer",
      modalTitle: "Modifier une équipe"
    }
  }
})

const {removeTeamByUuid, updateTeam, setTeamColor} = useTeamStore();

const props = defineProps(['uuid', 'name', 'color'])

const showDialog = ref(false)

const selectedColor = computed({
  get() {
    return props.color
  },
  set(value: string) {
    setTeamColor(props.name, value)
  }
})

function update(payload: {name: string, color: string}) {
  updateTeam(props.uuid, payload.name, payload.color)
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
    removeTeamByUuid(props.name)
  }).catch(() => {
    // Do nothing
  })
}
</script>

<template>
  <el-card>
    <template #header>
      {{name}}
      <div v-if="color" class="color-pin" :style="{'background-color': color}" />
    </template>
    <template #default>
      <el-button icon="EditPen" @click="showDialog = true" />
      <el-dialog v-model="showDialog" width="90%" :title="t('modalTitle')" @close="showDialog = false">
        <team-editor
            :initial-name="name"
            :initial-color="color"
            :can-delete="true"
            @submit="update"
            @cancel="showDialog = false"
            @delete="confirmDeletion" />
      </el-dialog>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.color-pin {
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
  margin-left: 1em;
  border-radius: 50%;
}
</style>