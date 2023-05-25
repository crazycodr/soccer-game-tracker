import {defineStore} from 'pinia'
import {computed} from 'vue'
import {useLocalStorage} from '@vueuse/core'

export const useOptionStore = defineStore('options', () => {

  const language = useLocalStorage('options_language', 'en')

  const tracking_sorting = useLocalStorage('options_tracking_sort', TrackingSortOptions.TRACKING_SORT_HIGHEST_BENCH)

  const getLanguage = computed((): string => {
    return language.value
  })

  const getTrackingSorting = computed((): TrackingSortOptions => {
    return <TrackingSortOptions>tracking_sorting.value
  })

  function setLanguage(value: string) {
    language.value = value;
  }

  function setTrackingSorting(value: TrackingSortOptions) {
    tracking_sorting.value = value;
  }

  return {
    getLanguage,
    getTrackingSorting,
    setLanguage,
    setTrackingSorting
  }
})

export enum TrackingSortOptions {
  TRACKING_SORT_HIGHEST_BENCH = 'highest_bench',
  TRACKING_SORT_NAME = 'name',
  TRACKING_SORT_JERSEY = 'jersey',
}

