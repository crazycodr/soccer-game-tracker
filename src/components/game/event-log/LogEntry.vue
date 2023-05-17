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

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameLog: 'Event log',
      eventGoal: '{name} scored a goal',
      eventPass: '{name} made a decisive pass',
      eventGoalReverted: 'Goal for {name} was reverted',
      eventPassRevert: 'Decisive pass for {name} was reverted',
      eventUnknown: 'Unknown event'
    },
    fr: {
      gameLog: 'Évènements',
      eventGoal: '{name} à marqué un but',
      eventPass: '{name} à contribué avec une passe décisive',
      eventGoalReverted: 'Un but de {name} à été révoqué',
      eventPassRevert: 'Une passe décisive de {name} à été révoquée',
      eventUnknown: 'Évènement inconnu'
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

let team: Team | null = null
let player: RegistryPlayer | null = null
if (props.event?.forTeamUuid) {
  team = getTeamByUuid(props.event?.forTeamUuid)
}
if (props.event?.byPlayerUuid) {
  player = getPlayerFromRegistryByUuid(props.event?.byPlayerUuid)
}

const formattedTime = computed(() => {
  const seconds = Math.floor(props.event?.atSeconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(props.event?.atSeconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const logText = computed(() => {
  switch (props.event?.type) {
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