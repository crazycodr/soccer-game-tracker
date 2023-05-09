import {defineStore} from 'pinia'
import {computed} from 'vue'
import {useLocalStorage} from '@vueuse/core'

export const useOptionStore = defineStore('options', () => {

  const language = useLocalStorage('options_language', 'en')

  const getLanguage = computed((): string => {
    return language.value
  })

  function setLanguage(value: string) {
    language.value = value;
  }

  return {
    getLanguage,
    setLanguage
  }
})

