<script lang="ts" setup>

import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {find} from "lodash";
import {Team} from "@/stores/models/Team";
import {storeToRefs} from "pinia";
import {useTeamStore} from "@/stores/TeamStore";

const {getTeams} = storeToRefs(useTeamStore())

const {t} = useI18n({
  messages: {
    en: {
      playerName: "Name",
      playerTeam: "Team",
      playerJacketNumber: "Jacket number",
      cancelOption: "Cancel",
      updateOption: "Update"
    },
    fr: {
      playerName: "Nom",
      playerTeam: "Équipe",
      playerJacketNumber: "Numéro de gillet",
      cancelOption: "Annuler",
      updateOption: "Mettre à jour"
    }
  }
})

const emit = defineEmits< {
  (e: 'submit', payload: {name: string, team: string, jacketNumber: string}): void,
  (e: 'cancel'): void,
  (e: 'delete'): void
}>()

const props = defineProps({
  canDelete: { type: Boolean, default: false },
  initialName: { type: String, default: '' },
  initialTeam: { type: String, default: '' },
  initialJacketNumber: { type: String, default: '' }
})

const editedName = ref(props.initialName)
const editedTeam = ref(props.initialTeam)
const editedJacketNumber = ref(props.initialJacketNumber)

const editedSelectedTeam = computed({
  get(){
    return find(getTeams.value, (team: Team) => {
      return team.uuid === editedTeam.value
    })
  },
  set(team){
    editedTeam.value = team ? team.uuid : ''
  }
})

function submitOnEnter(key: KeyboardEvent) {
  if (key.key === 'Enter') {
    emitSubmit()
  }
}

function emitSubmit() {
  emit('submit', {
    name: editedName.value,
    team: editedTeam.value,
    jacketNumber: editedJacketNumber.value
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
    <el-form-item :label="t('playerName')" required>
      <el-input @keyup="submitOnEnter" v-model="editedName" minlength="1" />
    </el-form-item>
    <el-form-item :label="t('playerTeam')" required>
      <el-select v-model="editedSelectedTeam" value-key="uuid">
        <el-option
            v-for="team in getTeams"
            :key="team.uuid"
            :value="team" :label="team.name" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('playerJacketNumber')">
      <el-input @keyup="submitOnEnter" type="text" v-model="editedJacketNumber" />
    </el-form-item>
    <el-form-item>
      <el-button icon="RemoveFilled" type="danger" @click="emitDelete" />
      <el-button class="push-right" @click="emitCancel">{{ t('cancelOption') }}</el-button>
      <el-button type="primary" @click="emitSubmit">{{ t('updateOption') }}</el-button>
    </el-form-item>
  </el-form>
</template>