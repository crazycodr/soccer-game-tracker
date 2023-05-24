<script lang="ts" setup>
import type {PropType} from 'vue'
import {computed} from 'vue'
import type {Event} from '@/stores/models/Event'
import {EventEnum} from '@/stores/models/Event'
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
import {CircleCloseFilled} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameLog: 'Event log',
      eventGoal: '{name} scored a goal',
      eventPass: '{name} made a decisive pass',
      eventPlayerGoesToField: '{name} goes to the field',
      eventPlayerGoesToBench: '{name} goes to the bench',
      eventPlayerGoesToGoal: '{name} goes to the goal',
      eventGameTimerStart: 'Game timer started (at {realDate})',
      eventGameTimerStop: 'Game timer stopped (at {realDate})',
      eventUnknown: 'Unknown event',
      noRecordedDate: 'No valid date recorded',
      confirmTitle: "Confirm deletion",
      warningMessage: "Warning, deleting an event can have catastrophic effects on live calculations! Are you sure you want to delete this event?",
      cancelOption: "Cancel",
      deleteOption: "Delete"
    },
    fr: {
      gameLog: 'Évènements',
      eventGoal: '{name} à marqué un but',
      eventPass: '{name} à contribué avec une passe décisive',
      eventPlayerGoesToField: '{name} se dirige au jeu',
      eventPlayerGoesToBench: '{name} se dirige au banc',
      eventPlayerGoesToGoal: '{name} se dirige au but',
      eventGameTimerStart: 'Chronomètre de partie démarré (à {realDate})',
      eventGameTimerStop: 'Chronomètre de partie arrêté (à {realDate})',
      eventUnknown: 'Évènement inconnu',
      noRecordedDate: 'Aucune date valide enregistrée',
      confirmTitle: "Confirmation de la suppression",
      warningMessage: "Attention: La suppression d'un événement peut entrainer des effets catastrophiques sur le calcul des statistiques en temps réel! Etes-vous certains de vouloir supprimer cette entrée?",
      cancelOption: "Annuler",
      deleteOption: "Supprimer"
    }
  }
})

const props = defineProps({
  event: {
    type: Object as PropType<Event>,
    required: true
  }
})

const {getTeamByUuid} = useTeamStore()
const {getPlayerFromRegistryByUuid} = useRegistryStore()
const {getLanguage} = storeToRefs(useOptionStore())
const {getEvents} = storeToRefs(useEventStore())
const {deleteEvent} = useEventStore()

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
  const gameTimerEvents = filter(getEvents.value, (event: Event) => {
    return event.type === EventEnum.GAME_TIMER_START || event.type === EventEnum.GAME_TIMER_STOP
  })
  const timerEventsBeforeCurrentEvent = filter(gameTimerEvents, (event: Event) => {
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
    default:
      return t('eventUnknown', {name: player?.name})
  }
})

const confirmDeletion = () => {
  ElMessageBox.confirm(
      t('warningMessage'),
      t('confirmTitle'),
      {
        confirmButtonText: t('deleteOption'),
        cancelButtonText: t('cancelOption')
      }
  ).then(() => {
    deleteEvent(props.event)
  }).catch(() => {
    // Do nothing
  })
}

locale.value = getLanguage.value
</script>
<template>
  <div class="log-entry">
    <span class="delete-command" @click="confirmDeletion"><el-icon><CircleCloseFilled /></el-icon></span>
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

  .delete-command {
    width: 2em;
    flex-shrink: 0;
  }

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