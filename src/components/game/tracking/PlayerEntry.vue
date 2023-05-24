<script setup lang="ts">
import {computed} from "vue";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useGameStore} from "@/stores/GameStore";
import {useI18n} from 'vue-i18n'
import {filter} from "lodash";
import type {Event} from "@/stores/models/Event";
import {
  getBenchingDurationFromPlayerTimerEvents,
  getFieldDurationFromPlayerTimerEvents,
  getGoalingDurationFromPlayerTimerEvents
} from "@/modules/time/TimeCalculation";
import {formatTimeFromSeconds} from "@/modules/time/TimeFormatting";
import {storeToRefs} from "pinia";
import {useEventStore} from "@/stores/EventStore";
import {PlayerStatusEnum} from "@/stores/models/Player";

const {t} = useI18n({
  messages: {
    en: {
      goalsLabel: "Goals",
      passesLabel: "Dec. passes",
      benchingLabel: "Benching",
      benchedLabel: "Benched",
      goalingLabel: "Goaling",
      goaledLabel: "Goaled",
      playingLabel: "Playing",
      playedLabel: "Played",
      playAction: "To field",
      benchAction: "To bench",
      goalAction: "To goal",
      goalAbbreviation: "G",
      passAbbreviation: "DP"
    },
    fr: {
      goalsLabel: "Buts",
      passesLabel: "Passes Déc.",
      benchingLabel: "Sur le banc",
      benchedLabel: "Temps au banc",
      goalingLabel: "Garde les buts",
      goaledLabel: "Temps de gardien",
      playingLabel: "En jeu",
      playedLabel: "Temps en jeu",
      playAction: "Au jeu",
      benchAction: "Au banc",
      goalAction: "Au but",
      goalAbbreviation: "B",
      passAbbreviation: "PD"
    }
  }
})

const {
  sendToField,
  sendToBench,
  sendToGoal,
  increaseGoals,
  increasePasses
} = usePlayerStore()
const {tickCounter} = storeToRefs(useGameStore())
const {getEvents} = storeToRefs(useEventStore())

const props = defineProps(['uuid', 'name', 'status', 'goals', 'passes', 'jacketNumber'])

const benchTimeSince = computed(() => {
  const playerTimerEvents = filter(getEvents.value, (event: Event) => {
    return event.references.playerUuid === props.uuid || event.references.playerUuid === null
  })
  const secondsBeforeCurrentEvent = getBenchingDurationFromPlayerTimerEvents(playerTimerEvents, new Date())
  /**
   * This strange +/- tickCounter is to stimulate redraw of the property because it is event based
   * and would not change on tick.
   */
  return formatTimeFromSeconds(secondsBeforeCurrentEvent + tickCounter.value - tickCounter.value)
})

const playingTimeSince = computed(() => {
  const playerTimerEvents = filter(getEvents.value, (event: Event) => {
    return event.references.playerUuid === props.uuid || event.references.playerUuid === null
  })
  const secondsBeforeCurrentEvent = getFieldDurationFromPlayerTimerEvents(playerTimerEvents, new Date())
  /**
   * This strange +/- tickCounter is to stimulate redraw of the property because it is event based
   * and would not change on tick.
   */
  return formatTimeFromSeconds(secondsBeforeCurrentEvent + tickCounter.value - tickCounter.value)
})

const goalingTimeSince = computed(() => {
  const playerTimerEvents = filter(getEvents.value, (event: Event) => {
    return event.references.playerUuid === props.uuid || event.references.playerUuid === null
  })
  const secondsBeforeCurrentEvent = getGoalingDurationFromPlayerTimerEvents(playerTimerEvents, new Date())
  /**
   * This strange +/- tickCounter is to stimulate redraw of the property because it is event based
   * and would not change on tick.
   */
  return formatTimeFromSeconds(secondsBeforeCurrentEvent + tickCounter.value - tickCounter.value)
})

const playingStatus = computed(() => {
  return isPlaying.value ? t('playingLabel') : t('playedLabel')
})

const benchingStatus = computed(() => {
  return isBenching.value ? t('benchingLabel') : t('benchedLabel')
})

const goalingStatus = computed(() => {
  return isGoaling.value ? t('goalingLabel') : t('goaledLabel')
})

const isPlaying = computed(() => {
  return props.status === PlayerStatusEnum.playing
})

const isBenching = computed(() => {
  return props.status === PlayerStatusEnum.benching
})

const isGoaling = computed(() => {
  return props.status === PlayerStatusEnum.goaling
})

function affectGoals(uuid: string) {
  increaseGoals(uuid)
}

function affectPasses(uuid: string) {
  increasePasses(uuid)
}
</script>
<template>
  <el-card>
    <template #header>
      <div class="player-name">
        {{ name }}
        <span v-if="jacketNumber !== ''"> (#{{ jacketNumber }})</span>
      </div>
    </template>
    <template #default>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-row :class="{status: true, playing: isPlaying}">
            <el-col class="label" :span="18">{{ playingStatus }}</el-col>
            <el-col class="timer" :span="6">{{ playingTimeSince }}</el-col>
          </el-row>
          <el-row :class="{status: true, goaling: isGoaling}">
            <el-col class="label" :span="18">{{ goalingStatus }}</el-col>
            <el-col class="timer" :span="6">{{ goalingTimeSince }}</el-col>
          </el-row>
          <el-row :class="{status: true, benching: isBenching}">
            <el-col class="label" :span="18">{{ benchingStatus }}</el-col>
            <el-col class="timer" :span="6">{{ benchTimeSince }}</el-col>
          </el-row>
          <el-row class="statistic" style="margin-top: 0.5em">
            <el-col class="label" :span="18">{{ t('goalsLabel') }}</el-col>
            <el-col class="timer" :span="6">{{ goals }}</el-col>
          </el-row>
          <el-row class="statistic">
            <el-col class="label" :span="18">{{ t('passesLabel') }}</el-col>
            <el-col class="timer" :span="6">{{ passes }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button :disabled="!(isPlaying || isGoaling)" class="status-button" @click="affectGoals(uuid)">{{goals}} {{t('goalAbbreviation')}}</el-button>
            </el-col>
            <el-col :span="12">
              <el-button :disabled="!(isPlaying || isGoaling)" class="status-button" @click="affectPasses(uuid)">{{passes}} {{t('passAbbreviation')}}</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 0.5em">
            <el-col :span="24">
              <el-button :disabled="isBenching" class="status-button" @click="sendToBench(uuid)">{{
                  t('benchAction')
                }}
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 0.5em">
            <el-col :span="24">
              <el-button :disabled="isPlaying || isGoaling" class="status-button" @click="sendToField(uuid)">{{
                  t('playAction')
                }}
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 0.5em">
            <el-col :span="24">
              <el-button :disabled="isPlaying || isGoaling" class="status-button" @click="sendToGoal(uuid)">{{
                  t('goalAction')
                }}
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.player-name {
  font-size: 1.5em;
}

.statistic {
  color: darkgrey;
}

.status {
  color: darkgrey;

  &.playing, &.goaling {
    color: green;
  }

  &.benching {
    color: red;
  }
}

.status-button {
  width: 100%;
}
</style>