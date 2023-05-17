<script setup lang="ts">

import {useI18n} from 'vue-i18n'
import type {PropType} from 'vue'
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useOptionStore} from '@/stores/OptionStore'
import {join, map} from 'lodash'
import type {Team} from '@/stores/models/Team'
import type {Game} from '@/stores/models/Game'
import {useTeamStore} from '@/stores/TeamStore'
import {useGameStore} from '@/stores/GameStore'
import {useRegistryStore} from '@/stores/RegistryStore'
import {usePlayerStore} from "@/stores/PlayerStore";
import type {Player} from "@/stores/models/Player";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      inProgress: 'In-progress',
      teams: 'Teams',
      players: 'Players',
      addGameToRegistry: 'Add game to registry',
      updateGameInRegistry: 'Update game'
    },
    fr: {
      inProgress: 'En cours',
      teams: 'Équipes',
      players: 'Joueurs',
      addGameToRegistry: 'Ajouter au registre',
      updateGameInRegistry: 'Mettre à jour'
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())
const {getTeams} = storeToRefs(useTeamStore())
const {getPlayers} = storeToRefs(usePlayerStore())
const {upsertGameInRegistry} = useRegistryStore()

locale.value = getLanguage.value

const props = defineProps({
  activeGame: {
    type: Object as PropType<Game>,
    required: true
  }
})

const {getGame} = storeToRefs(useGameStore())
const {getGameFromRegistryByUuid} = useRegistryStore()

const teamNameList = computed(() => {
  const teams = getTeams.value
  const names = map(teams, (team: Team) => team.name)
  return join(names, ', ')
})

const playerNameList = computed(() => {
  const players = getPlayers.value
  const names = map(players, (player: Player) => player.name)
  return join(names, ', ')
})

const formattedTime = computed(() => {
  const seconds = Math.floor(props.activeGame?.seconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(props.activeGame?.seconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const isGameActive = computed(() => getGame.value.seconds > 0)

const addSaveButtonLabel = computed(() => {
  if (isGameActive.value && getGameFromRegistryByUuid(getGame.value.uuid)) {
    return t('updateGameInRegistry')
  } else {
    return t('addGameToRegistry')
  }
})

function addSaveActiveGame() {
  upsertGameInRegistry(getGame.value)
}
</script>

<template>
  <el-card class="in-progress">
    <template #header>
      <div class="name">{{ t('inProgress') }}: {{ formattedTime }}</div>
    </template>
    <template #default>
      <div class="teams">
        <span class="strong-label">{{ t('teams') }}</span>:
        {{ teamNameList }}
      </div>
      <div class="players">
        <span class="strong-label">{{ t('players') }}</span>:
        {{ playerNameList }}
      </div>
      <el-button icon="CirclePlusFilled" @click="addSaveActiveGame">{{ addSaveButtonLabel }}</el-button>
    </template>
  </el-card>
</template>

<style scoped lang="scss">

.in-progress {
  background-color: beige;
}

.name {
  font-size: 1.1em;
}

.teams, .players {
  margin-bottom: 1em;
}

.strong-label {
  font-weight: bold;
}
</style>