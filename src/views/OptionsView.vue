<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {computed, ref} from "vue"
import {storeToRefs} from "pinia"
import {useOptionStore} from "@/stores/OptionStore"
import {useRouter} from "vue-router";

const {getLanguage} = storeToRefs(useOptionStore())
const {setLanguage} = useOptionStore()

const router = useRouter()

function reloadPage() {
  router.go(0)
}

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
    <el-radio-group class="languageOptions" v-model="selectedLanguage">
      <el-radio-button label="en">{{ t('languageEn') }}</el-radio-button>
      <el-radio-button label="fr">{{ t('languageFr') }}</el-radio-button>
    </el-radio-group>
  </main>
</template>

<style scoped lang="scss">
.options-view {
  margin-bottom: 30em;

  .title {
    margin-bottom: 1em;
  }

  .languageOptions {
    margin-bottom: 2em;
  }

  .warning-alert {
    margin-bottom: 1em;
  }
}
</style>