import {defineStore} from 'pinia'
import {computed} from 'vue'
import {useLocalStorage} from '@vueuse/core'

export const useOptionStore = defineStore('options', () => {

  const language = useLocalStorage('options_language', 'en')

  const tracking_sorting = useLocalStorage('options_tracking_sort', TrackingSortOptions.TRACKING_SORT_HIGHEST_BENCH)

  const players_config = useLocalStorage('options_players_config', GamePlayersEnum.PLAYERS_5_X_5)

  const getLanguage = computed((): string => {
    return language.value
  })

  const getTrackingSorting = computed((): TrackingSortOptions => {
    return <TrackingSortOptions>tracking_sorting.value
  })

  const getPlayersConfig = computed((): GamePlayersEnum => {
    return <GamePlayersEnum>players_config.value
  })

  function setLanguage(value: string) {
    language.value = value;
  }

  function setTrackingSorting(value: TrackingSortOptions) {
    tracking_sorting.value = value;
  }

  function setPlayersConfig(value: GamePlayersEnum) {
    players_config.value = value;
  }

  return {
    getLanguage,
    getTrackingSorting,
    getPlayersConfig,
    setLanguage,
    setTrackingSorting,
    setPlayersConfig
  }
})

export enum TrackingSortOptions {
  TRACKING_SORT_HIGHEST_BENCH = 'highest_bench',
  TRACKING_SORT_NAME = 'name',
  TRACKING_SORT_JERSEY = 'jersey',
}

export enum GamePlayersEnum {
  PLAYERS_3_X_3 = '3x3',
  PLAYERS_5_X_5 = '5x5',
  PLAYERS_7_X_7 = '7x7',
  PLAYERS_9_X_9 = '9x9',
  PLAYERS_11_X_11 = '11x11',
}

