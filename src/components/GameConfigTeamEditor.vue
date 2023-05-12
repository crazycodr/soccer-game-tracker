<script setup lang="ts">
import {useTeamStore} from "@/stores/TeamStore";
import {computed, ref} from "vue";
import {ElColorPicker, ElMessageBox} from "element-plus";
import {useI18n} from "vue-i18n";
import TeamEditor from "@/components/TeamEditor.vue";

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
  <main class="config-team">
    <div class="name">{{name}}</div>
    <el-color-picker class="color" v-model="selectedColor" />
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

  .color {
    flex-basis: 25%;
  }
}
</style>