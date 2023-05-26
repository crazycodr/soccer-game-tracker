<script setup lang="ts">
import {computed} from "vue";
import {useI18n} from 'vue-i18n'
import {filter, first} from "lodash";
import type {Event} from "@/stores/models/Event";
import {EventEnum} from "@/stores/models/Event";
import {formatTimeFromSeconds} from "@/modules/time/TimeFormatting";
import {storeToRefs} from "pinia";
import {useEventStore} from "@/stores/EventStore";
import {Player, PlayerStatusEnum} from "@/stores/models/Player";
import {usePlayerStore} from "@/stores/PlayerStore";

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

const {getEvents} = storeToRefs(useEventStore())
const {getPlayers} = storeToRefs(usePlayerStore())

const props = defineProps(['uuid', 'name', 'status', 'jersey'])

const player = computed(() => {
  const matchingPlayers = filter(getPlayers.value, (player: Player) => {
    return player.uuid === props.uuid
  })
  return <Player>first(matchingPlayers);
})

const benchTimeSince = computed(() => {
  return formatTimeFromSeconds(player.value.benchingSeconds)
})

const playingTimeSince = computed(() => {
  return formatTimeFromSeconds(player.value.playingSeconds)
})

const goalingTimeSince = computed(() => {
  return formatTimeFromSeconds(player.value.goalingSeconds)
})

const playerGoals = computed(() => {
  return filter(getEvents.value, (event: Event) => {
    return event.references.playerUuid === props.uuid
        && event.type === EventEnum.GOAL
  }).length
})

const playerDecisivePasses = computed(() => {
  return filter(getEvents.value, (event: Event) => {
    return event.references.playerUuid === props.uuid
        && event.type === EventEnum.PASS
  }).length
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
</script>
<template>
  <el-card>
    <template #header>
      <div class="player-name">
        {{ name }}
        <span v-if="jersey !== ''"> (#{{ jersey }})</span>
      </div>
    </template>
    <template #default>
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
        <el-col class="timer" :span="6">{{ playerGoals }}</el-col>
      </el-row>
      <el-row class="statistic">
        <el-col class="label" :span="18">{{ t('passesLabel') }}</el-col>
        <el-col class="timer" :span="6">{{ playerDecisivePasses }}</el-col>
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