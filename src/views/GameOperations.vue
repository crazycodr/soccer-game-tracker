<script setup lang="ts">

import GameModeToggle from "@/components/GameModeToggle.vue";
</script>

<template>
  <el-row style="margin-bottom: 1em">
    <el-alert :closable="false" type="warning">Settings in this page do not persist. If you refresh the page, they are lost!</el-alert>
  </el-row>
  <el-row>
    <GameModeToggle />
  </el-row>
</template>

<style scoped>
.game-operations {
  margin-bottom: 30em;
}
</style>