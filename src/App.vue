<script setup lang="ts">
import {RouterView, useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useOptionStore} from "@/stores/OptionStore"
import {storeToRefs} from "pinia"

const router = useRouter()
const route = useRoute()

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      menu: "Menu"
    },
    fr: {
      menu: "Menu"
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value
</script>

<template>
  <div class="menu" v-if="route.name !== 'menu'">
    <el-button icon="Grid" @click="router.push({name: 'menu'})">{{ t('menu') }}</el-button>
  </div>
  <div class="content">
    <RouterView/>
  </div>
</template>

<style scoped lang="scss">
.content {
  padding: 1em;
}
.menu {
  padding: 1em;
  text-align: right;
}
</style>