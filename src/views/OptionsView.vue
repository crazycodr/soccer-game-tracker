<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {computed, ref} from "vue"
import {storeToRefs} from "pinia"
import {useOptionStore} from "@/stores/OptionStore"

const {getLanguage} = storeToRefs(useOptionStore())
const {setLanguage} = useOptionStore()

const languageChanged = ref(false)

const {t} = useI18n({
  messages: {
    en: {
      languageTitle: "Language",
      languageEn: "English",
      languageFr: "French",
      changeWarning: 'You must reload the application to apply changes to the language.'
    },
    fr: {
      languageTitle: "Langue",
      languageEn: "Anglais",
      languageFr: "Français",
      changeWarning: 'Vous devez recharger l\'application pour appliquer le changement de langue.'
    }
  }
})

const selectedLanguage = computed({
  get() {
    return getLanguage.value
  },
  set(value: string) {
    languageChanged.value = true
    setLanguage(value)
  }
})
</script>

<template>
  <main class="options-view">
    <h2>{{ t('languageTitle') }}</h2>
    <el-row>
      <div class="warning-alert" v-if="languageChanged">
        <el-alert type="warning">{{ t('changeWarning') }}</el-alert>
      </div>
    </el-row>
    <el-row>
      <el-radio-group class="languageOptions" v-model="selectedLanguage">
        <el-radio-button label="en">{{ t('languageEn') }}</el-radio-button>
        <el-radio-button label="fr">{{ t('languageFr') }}</el-radio-button>
      </el-radio-group>
    </el-row>
  </main>
</template>

<style scoped lang="scss">
.options-view {
  margin-bottom: 30em;
}
.languageOptions {
  margin-bottom: 2em;
}
</style>