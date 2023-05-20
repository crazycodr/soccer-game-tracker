<script setup lang="ts">

import {useI18n} from 'vue-i18n'
import type {PropType} from 'vue'
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useOptionStore} from '@/stores/OptionStore'
import {each, join, map} from 'lodash'
import type {Team} from '@/stores/models/Team'
import type {Player} from "@/stores/models/Player";
import type {RegistryGame} from "@/stores/models/RegistryGame";
import {useGameStore} from "@/stores/GameStore";
import {useEventStore} from "@/stores/EventStore";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useTeamStore} from "@/stores/TeamStore";
import type {GameEvent} from "@/stores/models/GameEvent";
import {formatTimeFromSeconds} from "@/modules/time/TimeFormatting";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      inProgress: 'In-progress',
      teams: 'Teams',
      players: 'Players',
      loadGame: 'Load this game'
    },
    fr: {
      inProgress: 'En cours',
      teams: 'Équipes',
      players: 'Joueurs',
      loadGame: 'Charger cette partie'
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())
const {resetGoals, resetPasses, resetTimers, resetStatuses} = useGameStore()
const {getGame} = storeToRefs(useGameStore())
const {resetEvents, addEvent} = useEventStore()
const {resetPlayers, addPlayer} = usePlayerStore()
const {resetTeams, addTeam} = useTeamStore()

locale.value = getLanguage.value

const props = defineProps({
  registryGame: {
    type: Object as PropType<RegistryGame>,
    required: true
  }
})

const teamNameList = computed(() => {
  const teams = props.registryGame.teams
  const names = map(teams, (team: Team) => team.name)
  return join(names, ', ')
})

const playerNameList = computed(() => {
  const players = props.registryGame.players
  const names = map(players, (player: Player) => player.name)
  return join(names, ', ')
})

const formattedTime = computed(() => {
  return formatTimeFromSeconds(props.registryGame?.seconds)
})

function loadGame() {
  resetTimers()
  resetStatuses()
  resetGoals()
  resetPasses()
  resetEvents()
  resetTeams()
  resetPlayers()
  getGame.value.uuid = props.registryGame?.uuid
  each(props.registryGame?.teams, (team: Team) => addTeam(team))
  each(props.registryGame?.players, (player: Player) => addPlayer(player))
  each(props.registryGame?.events, (event: GameEvent) => addEvent(event))
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="name">{{ formattedTime }}</div>
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
      <el-button icon="CirclePlusFilled" @click="loadGame">{{ t('loadGame') }}</el-button>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
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