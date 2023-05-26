<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {computed, ref} from "vue"
import {GamePlayersEnum, TrackingSortOptions, useOptionStore} from "@/stores/OptionStore"
import {useRouter} from "vue-router";
import {useGameStore} from "@/stores/GameStore";
function reloadPage() {
  useRouter().go(0)
}

const languageChanged = ref(false)

const {t} = useI18n({
  messages: {
    en: {
      languageTitle: "Language",
      languageEn: "English",
      languageFr: "French",
      changeWarning: 'You must reload the application to apply changes to the language.',
      trackingViewSortingTitle: 'Tracking view sort order',
      trackingViewSortingBenchTime: 'Benching time',
      trackingViewSortingName: 'Name',
      trackingViewSortingJersey: 'Jersey',
      resetGameTitle: 'Erase current game',
      resetGameButton: 'Erase',
      gamePlayers: 'Configuration',
      gamePlayers3x3: '3x3',
      gamePlayers5x5: '5x5',
      gamePlayers7x7: '7x7',
      gamePlayers9x9: '9x9',
      gamePlayers11x11: '11x11',
    },
    fr: {
      languageTitle: "Langue",
      languageEn: "Anglais",
      languageFr: "Français",
      changeWarning: 'Vous devez recharger l\'application pour appliquer le changement de langue.',
      trackingViewSortingTitle: 'Ordre de tri dans suivi',
      trackingViewSortingBenchTime: 'Temps sur le banc',
      trackingViewSortingName: 'Nom',
      trackingViewSortingJersey: 'Numéro',
      resetGameTitle: 'Effacer la partie',
      resetGameButton: 'Effacer',
      gamePlayers: 'Configuration',
      gamePlayers3x3: '3x3',
      gamePlayers5x5: '5x5',
      gamePlayers7x7: '7x7',
      gamePlayers9x9: '9x9',
      gamePlayers11x11: '11x11',
    }
  }
})

const selectedLanguage = computed({
  get() {
    return useOptionStore().getLanguage
  },
  set(value: string) {
    languageChanged.value = true
    useOptionStore().setLanguage(value)
  }
})

const selectedTrackingSorting = computed({
  get() {
    return useOptionStore().getTrackingSorting
  },
  set(value: TrackingSortOptions) {
    useOptionStore().setTrackingSorting(value)
  }
})

const selectedGamePlayers = computed({
  get() {
    return useOptionStore().getPlayersConfig
  },
  set(value: GamePlayersEnum) {
    useOptionStore().setPlayersConfig(value)
  }
})

function resetGame() {
  useGameStore().resetGame()
}
</script>

<template>
  <main class="options-view">
    <el-row>
      <el-col>
        <h2 class="title">{{ t('languageTitle') }}</h2>
        <div class="warning-alert" v-if="languageChanged">
          <el-alert type="warning" :closable="false">
            <el-row style="margin-bottom: 1em;" justify="space-between">
              <el-col>{{ t('changeWarning') }}</el-col>
            </el-row>
            <el-row justify="space-between">
              <el-col>
                <el-button type="warning" @click="reloadPage">Reload</el-button>
              </el-col>
            </el-row>
          </el-alert>
        </div>
        <el-radio-group v-model="selectedLanguage">
          <el-radio-button label="en">{{ t('languageEn') }}</el-radio-button>
          <el-radio-button label="fr">{{ t('languageFr') }}</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row style="margin-top: 1em">
      <el-col>
        <h2 class="title">{{ t('trackingViewSortingTitle') }}</h2>
        <el-radio-group v-model="selectedTrackingSorting">
          <el-radio-button :label="TrackingSortOptions.TRACKING_SORT_HIGHEST_BENCH">{{ t('trackingViewSortingBenchTime') }}</el-radio-button>
          <el-radio-button :label="TrackingSortOptions.TRACKING_SORT_NAME">{{ t('trackingViewSortingName') }}</el-radio-button>
          <el-radio-button :label="TrackingSortOptions.TRACKING_SORT_JERSEY">{{ t('trackingViewSortingJersey') }}</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row style="margin-top: 1em">
      <el-col>
        <h2 class="title">{{ t('gamePlayers') }}</h2>
        <el-radio-group v-model="selectedGamePlayers">
          <el-radio-button :label="GamePlayersEnum.PLAYERS_3_X_3">{{ t('gamePlayers3x3') }}</el-radio-button>
          <el-radio-button :label="GamePlayersEnum.PLAYERS_5_X_5">{{ t('gamePlayers5x5') }}</el-radio-button>
          <el-radio-button :label="GamePlayersEnum.PLAYERS_7_X_7">{{ t('gamePlayers7x7') }}</el-radio-button>
          <el-radio-button :label="GamePlayersEnum.PLAYERS_9_X_9">{{ t('gamePlayers9x9') }}</el-radio-button>
          <el-radio-button :label="GamePlayersEnum.PLAYERS_11_X_11">{{ t('gamePlayers11x11') }}</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row style="margin-top: 1em">
      <el-col>
        <h2 class="title">{{ t('resetGameTitle') }}</h2>
        <el-button @click="resetGame" type="danger">{{ t('resetGameButton') }}</el-button>
      </el-col>
    </el-row>
  </main>
</template>

<style scoped lang="scss">
.options-view {
  margin-bottom: 30em;

  .title {
    margin-bottom: 1em;
  }

  .warning-alert {
    margin-bottom: 1em;
  }
}
</style>