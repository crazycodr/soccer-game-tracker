<script setup lang="ts">
import {RouterView} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useOptionStore} from "@/stores/OptionStore";
import {storeToRefs} from "pinia";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameMenu: "Game",
      operationsMenu: "Ops",
      configureMenu: "Config",
      optionsMenu: "Options"
    },
    fr: {
      gameMenu: "Partie",
      operationsMenu: "Ops",
      configureMenu: "Config",
      optionsMenu: "Options"
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value
</script>

<template>
  <el-menu :router="true" default-active="/game" mode="horizontal">
    <el-menu-item index="/game">{{ t('gameMenu') }}</el-menu-item>
    <el-menu-item index="/operations">{{ t('operationsMenu') }}</el-menu-item>
    <el-menu-item index="/config">{{ t('configureMenu') }}</el-menu-item>
    <el-menu-item index="/options">{{ t('optionsMenu') }}</el-menu-item>
  </el-menu>

  <div class="content">
    <RouterView/>
  </div>
</template>

<style scoped lang="scss">
.content {
  padding: 1em;
}
</style>