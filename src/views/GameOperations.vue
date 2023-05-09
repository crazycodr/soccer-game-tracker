<script setup lang="ts">
import GameModeToggle from "@/components/GameModeToggle.vue";
import GameResetOperations from "@/components/GameResetOperations.vue";
import {useI18n} from 'vue-i18n'

const {t} = useI18n({
  messages: {
    en: {
      warning: "Settings in this page do not persist. If you refresh the page, they are lost!"
    },
    fr: {
      warning: "Les configurations de cette page ne sont pas conservées. Si vous rafraichissez cette page, elle seront perdues!"
    }
  }
})
</script>

<template>
  <main>
    <el-row class="section volatile-warning">
      <el-alert :closable="false" type="warning">{{ t('warning') }}</el-alert>
    </el-row>
    <el-row>
      <GameModeToggle class="section" />
    </el-row>
    <el-row>
      <GameResetOperations class="section" />
    </el-row>
  </main>
</template>

<style scoped lang="scss">
.volatile-warning {
  margin-bottom: 1em;
}

.section {
  margin-bottom: 3em;
}
</style>