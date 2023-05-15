<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "@/stores/GameStore";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";

const {t} = useI18n({
  messages: {
    en: {
      gameModeTitle: "Effect of statistic buttons",
      incrementOption: "Increment",
      decrementOption: "Decrement"
    },
    fr: {
      gameModeTitle: "Effets des boutons de statistiques",
      incrementOption: "Augmenter",
      decrementOption: "Réduire"
    }
  }
})

const {getStatMode} = storeToRefs(useGameStore());
const {setToAdditionMode, setToRemovalMode, STAT_MODE_ADDITION, STAT_MODE_REMOVAL} = useGameStore();

const mode = computed({
  get: () => {
    return getStatMode.value
  },
  set: (value: number) => {
    switch (value) {
      case STAT_MODE_ADDITION:
        setToAdditionMode()
        break
      case STAT_MODE_REMOVAL:
        setToRemovalMode()
        break
    }
  }
})
</script>

<template>
  <main>
    <h2>{{ t('gameModeTitle') }}</h2>
    <el-radio-group v-model="mode">
      <el-radio-button :label="STAT_MODE_ADDITION">{{ t('incrementOption') }}</el-radio-button>
      <el-radio-button :label="STAT_MODE_REMOVAL">{{ t('decrementOption') }}</el-radio-button>
    </el-radio-group>
  </main>
</template>

<style scoped lang="scss">
h2 {
  margin-bottom: 0.5em;
}
</style>