<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/stores/OptionStore";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";

const router = useRouter()

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameMenu: "Game",
      trackingMenu: "Track",
      operationsMenu: "Operations",
      configureMenu: "Configuration",
      optionsMenu: "Options"
    },
    fr: {
      gameMenu: "Partie",
      trackingMenu: "Suivi de la partie",
      operationsMenu: "Opérations",
      configureMenu: "Équipes et joueurs",
      optionsMenu: "Options"
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value
</script>

<template>
  <main>
    <h2 class="section-title">{{ t('gameMenu') }}</h2>
    <div>
      <el-button class="section-option" icon="Memo" @click="router.push({name: 'game'})">{{ t('trackingMenu') }}</el-button>
    </div>
    <div>
      <el-button class="section-option" icon="Operation" @click="router.push({name: 'operations'})">{{ t('operationsMenu') }}</el-button>
    </div>
    <div>
      <el-button class="section-option" icon="List" @click="router.push({name: 'config'})">{{ t('configureMenu') }}</el-button>
    </div>

    <h2 class="section-title">{{ t('optionsMenu') }}</h2>
    <div>
      <el-button class="section-option" icon="Setting" @click="router.push({name: 'options'})">{{ t('optionsMenu') }}</el-button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.section-title {
  margin-bottom: 1em;
}
.section-option {
  margin-bottom: 1em;
  width: 100%;
}
</style>