<script setup lang="ts">

import GameModeToggle from "@/components/GameModeToggle.vue";
import GameResetOperations from "@/components/GameResetOperations.vue";
</script>

<template>
  <main>
    <el-row class="section volatile-warning">
      <el-alert :closable="false" type="warning">Settings in this page do not persist. If you refresh the page, they are lost!</el-alert>
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