<script setup lang="ts">

import {useI18n} from 'vue-i18n'
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useOptionStore} from '@/stores/OptionStore'
import {filter, join, map} from 'lodash'
import type {Team} from '@/stores/models/Team'
import {useTeamStore} from '@/stores/TeamStore'
import {useGameStore} from '@/stores/GameStore'
import {useRegistryStore} from '@/stores/RegistryStore'
import {usePlayerStore} from "@/stores/PlayerStore";
import type {Player} from "@/stores/models/Player";
import {formatTimeFromSeconds} from "@/modules/time/TimeFormatting";
import {useEventStore} from "@/stores/EventStore";
import {EventEnum, GameEvent} from "@/stores/models/GameEvent";
import {getGameDurationFromGameTimerEvents} from "@/modules/time/TimeCalculation";

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

const {getEvents} = storeToRefs(useEventStore())
const {getGame, tickCounter} = storeToRefs(useGameStore())
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
  const gameTimerEvents = filter(getEvents.value, (event: GameEvent) => {
    return event.type === EventEnum.GAME_TIMER_START || event.type === EventEnum.GAME_TIMER_STOP
  })
  const secondsBeforeCurrentEvent = getGameDurationFromGameTimerEvents(gameTimerEvents, new Date())
  /**
   * This strange +/- tickCounter is to stimulate redraw of the property because it is event based
   * and would not change on tick.
   */
  return formatTimeFromSeconds(secondsBeforeCurrentEvent + tickCounter.value - tickCounter.value)
})

const isGameActive = computed(() => getEvents.value.length > 0)

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