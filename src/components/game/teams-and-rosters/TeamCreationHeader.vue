<script setup lang="ts">
import {ref} from "vue"
import {useTeamStore} from "@/stores/TeamStore";
import {Team} from "@/stores/models/Team";
import {ElButton} from "element-plus";
import {useI18n} from "vue-i18n";
import TeamEditor from "@/components/game/teams-and-rosters/TeamEditor.vue";

const {t} = useI18n({
  messages: {
    en: {
      modalTitle: "Create team"
    },
    fr: {
      modalTitle: "Créer une équipe"
    }
  }
})

const {addTeam} = useTeamStore();

const showDialog = ref(false)

function create(payload: {name: string, color: string}) {
  const team = new Team(payload.name)
  team.color = payload.color
  addTeam(team)
  showDialog.value = false
}
</script>

<template>
  <main>
    <el-dialog
        v-model="showDialog"
        style="width: 90%; max-width: 480px;"
        :title="t('modalTitle')"
        @close="showDialog = false">
      <team-editor
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