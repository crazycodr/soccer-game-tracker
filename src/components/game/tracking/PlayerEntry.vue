<script setup lang="ts">
import {computed} from "vue";
import {usePlayerStore} from "@/stores/PlayerStore";
import {useGameStore} from "@/stores/GameStore";
import {useI18n} from 'vue-i18n'

const {t} = useI18n({
  messages: {
    en: {
      benchingLabel: "Benching",
      benchedLabel: "Benched",
      playingLabel: "Playing",
      playedLabel: "Played",
      playAction: "Send to field",
      benchAction: "Send to bench",
      goalAbbreviation: "G",
      passAbbreviation: "P"
    },
    fr: {
      benchingLabel: "Sur le banc",
      benchedLabel: "Temps au banc",
      playingLabel: "En jeu",
      playedLabel: "Temps en jeu",
      playAction: "Env. au jeu",
      benchAction: "Env. au banc",
      goalAbbreviation: "B",
      passAbbreviation: "P"
    }
  }
})

const {unbenchPlayer, benchPlayer, increaseGoals, increasePasses, decreasePasses, decreaseGoals} = usePlayerStore()
const {inAdditionMode, inRemovalMode} = useGameStore()

const props = defineProps(['uuid', 'name', 'status', 'gameSeconds', 'benchSeconds', 'goals', 'passes', 'jacketNumber'])

const benchTimeSince = computed(() => {
  let referenceSeconds = props.benchSeconds
  const seconds = Math.floor(referenceSeconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(referenceSeconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const playingTimeSince = computed(() => {
  let referenceSeconds = props.gameSeconds
  const seconds = Math.floor(referenceSeconds % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = Math.floor(referenceSeconds / 60).toFixed(0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const playingStatus = computed(() => {
  return isPlaying.value ? t('playingLabel') : t('playedLabel')
})

const benchingStatus = computed(() => {
  return isBenching.value ? t('benchingLabel') : t('benchedLabel')
})

const isPlaying = computed(() => {
  return props.status === 'playing'
})

const isBenching = computed(() => {
  return props.status === 'benching'
})

function affectGoals(uuid: string) {
  if (inAdditionMode) {
    increaseGoals(uuid)
  }
  if (inRemovalMode) {
    decreaseGoals(uuid)
  }
}

function affectPasses(uuid: string) {
  if (inAdditionMode) {
    increasePasses(uuid)
  }
  if (inRemovalMode) {
    decreasePasses(uuid)
  }
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
          <el-row :class="{status: true, benching: isBenching}">
            <el-col class="label" :span="18">{{ benchingStatus }}</el-col>
            <el-col class="timer" :span="6">{{ benchTimeSince }}</el-col>
          </el-row>
          <el-row style="margin-top: 1em;">
            <el-col>
              <el-button v-if="isPlaying" class="status-button" @click="benchPlayer(uuid)">{{ t('benchAction') }}</el-button>
              <el-button v-if="isBenching" class="status-button" @click="unbenchPlayer(uuid)">{{ t('playAction') }}</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-row :gutter="10">
            <el-col :span="12"><el-button @click="affectGoals(uuid)">{{goals}} {{t('goalAbbreviation')}}</el-button></el-col>
            <el-col :span="12"><el-button @click="affectPasses(uuid)">{{passes}} {{t('passAbbreviation')}}</el-button></el-col>
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

.status {
  color: darkgrey;

  &.playing {
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