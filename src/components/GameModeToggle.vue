<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "@/stores/GameStore";
import {storeToRefs} from "pinia";

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
    <h3>Effect of statistic buttons</h3>
    <el-radio-group v-model="mode">
      <el-radio-button :label="STAT_MODE_ADDITION">Addition</el-radio-button>
      <el-radio-button :label="STAT_MODE_REMOVAL">Removal</el-radio-button>
    </el-radio-group>
  </main>
</template>

<style scoped>
h3 {
  margin-bottom: 0.5em;
}
</style>