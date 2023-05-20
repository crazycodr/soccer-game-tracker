<script lang="ts" setup>
import type {PropType} from 'vue'
import {computed} from 'vue'
import type {GameEvent} from '@/stores/models/GameEvent'
import {EventEnum} from '@/stores/models/GameEvent'
import {useTeamStore} from '@/stores/TeamStore'
import {useRegistryStore} from '@/stores/RegistryStore'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'
import {useOptionStore} from '@/stores/OptionStore'
import type {Team} from "@/stores/models/Team";
import type {RegistryPlayer} from "@/stores/models/RegistryPlayer";
import {formatTimeFromSeconds, getEventDate} from "@/modules/time/TimeFormatting";
import {useEventStore} from "@/stores/EventStore";
import {filter} from "lodash";
import {getGameDurationFromGameTimerEvents} from "@/modules/time/TimeCalculation";
import {formatDate} from "@vueuse/core";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameLog: 'Event log',
      eventGoal: '{name} scored a goal',
      eventPass: '{name} made a decisive pass',
      eventGoalReverted: 'Goal for {name} was reverted',
      eventPassRevert: 'Decisive pass for {name} was reverted',
      eventPlayerGoesToField: '{name} enters the field',
      eventPlayerGoesToBench: '{name} leaves to bench',
      eventPlayerGoesToGoal: '{name} starts to goal',
      eventGameTimerStart: 'Game timer started (at {realDate})',
      eventGameTimerStop: 'Game timer stopped (at {realDate})',
      eventUnknown: 'Unknown event',
      noRecordedDate: 'No valid date recorded'
    },
    fr: {
      gameLog: 'Évènements',
      eventGoal: '{name} à marqué un but',
      eventPass: '{name} à contribué avec une passe décisive',
      eventGoalReverted: 'Un but de {name} à été révoqué',
      eventPassRevert: 'Une passe décisive de {name} à été révoquée',
      eventPlayerGoesToField: '{name} entre en jeu',
      eventPlayerGoesToBench: '{name} quitte pour le banc',
      eventPlayerGoesToGoal: '{name} comment à garder les buts',
      eventGameTimerStart: 'Chronomètre de partie démarré (à {realDate})',
      eventGameTimerStop: 'Chronomètre de partie arrêté (à {realDate})',
      eventUnknown: 'Évènement inconnu',
      noRecordedDate: 'Aucune date valide enregistrée'
    }
  }
})

const props = defineProps({
  event: {
    type: Object as PropType<GameEvent>,
    required: true
  }
})

const {getTeamByUuid} = useTeamStore()
const {getPlayerFromRegistryByUuid} = useRegistryStore()
const {getLanguage} = storeToRefs(useOptionStore())
const {getEvents} = storeToRefs(useEventStore())

let team: Team | null = null
let player: RegistryPlayer | null = null
if (props.event?.references.teamUuid) {
  team = getTeamByUuid(props.event?.references.teamUuid)
}
if (props.event?.references.playerUuid) {
  player = getPlayerFromRegistryByUuid(props.event?.references.playerUuid)
}

const formattedTime = computed(() => {
  const propEventOn = getEventDate(props.event?.on)
  if (!propEventOn) {
    return ''
  }
  const gameTimerEvents = filter(getEvents.value, (event: GameEvent) => {
    return event.type === EventEnum.GAME_TIMER_START || event.type === EventEnum.GAME_TIMER_STOP
  })
  const timerEventsBeforeCurrentEvent = filter(gameTimerEvents, (event: GameEvent) => {
    const eventOn = getEventDate(event.on)
    if (eventOn && propEventOn) {
      return eventOn <= propEventOn
    }
    return false
  })
  const secondsBeforeCurrentEvent = getGameDurationFromGameTimerEvents(timerEventsBeforeCurrentEvent, propEventOn)
  return formatTimeFromSeconds(secondsBeforeCurrentEvent)
})

const logText = computed(() => {

  const realEventDate = getEventDate(props.event.on)
  const realEventString = realEventDate ? formatDate(realEventDate, 'H:mm:ss') : t('no-recorded-date');

  switch (props.event?.type) {
    case EventEnum.GAME_TIMER_START:
      return t('eventGameTimerStart', {name: player?.name, realDate: realEventString})
    case EventEnum.GAME_TIMER_STOP:
      return t('eventGameTimerStop', {name: player?.name, realDate: realEventString})
    case EventEnum.PLAYER_TO_FIELD:
      return t('eventPlayerGoesToField', {name: player?.name})
    case EventEnum.PLAYER_TO_BENCH:
      return t('eventPlayerGoesToBench', {name: player?.name})
    case EventEnum.PLAYER_TO_GOAL:
      return t('eventPlayerGoesToGoal', {name: player?.name})
    case EventEnum.GOAL:
      return t('eventGoal', {name: player?.name})
    case EventEnum.PASS:
      return t('eventPass', {name: player?.name})
    case EventEnum.REVERTED_GOAL:
      return t('eventGoalReverted', {name: player?.name})
    case EventEnum.REVERTED_PASS:
      return t('eventPassRevert', {name: player?.name})
    default:
      return t('eventUnknown', {name: player?.name})
  }
})

locale.value = getLanguage.value
</script>
<template>
  <div class="log-entry">
    <span class="formatted-time">{{ formattedTime }}</span>
    <span class="team-name" v-if="team">
      <span v-if="team.color" class="color-pin" :style="{'background-color': team.color}"/>
      {{ team.name }}
    </span>
    <span class="event-text">
      {{ logText }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.log-entry {
  display: flex;
  align-items: center;

  .formatted-time {
    width: 4em;
    flex-shrink: 0;
  }

  .team-name {
    width: 6em;
    overflow-x: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
  }

  .event-text {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
}
.color-pin {
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
  border-radius: 50%;
}
</style>