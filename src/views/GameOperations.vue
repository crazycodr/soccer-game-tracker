<script setup lang="ts">

import GameModeToggle from "@/components/GameModeToggle.vue";
</script>

<template>
  <main class="game-operations">
    <el-alert type="warning">Settings in this page do not persist. If you refresh the page, they are lost!</el-alert>
    <GameModeToggle />
  </main>
</template>

<style scoped>
.game-operations {
  margin-bottom: 30em;
}
</style>