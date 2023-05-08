<script setup lang="ts">
import GameScore from "@/components/GameScore.vue";
import GameRoster from "@/components/GameRoster.vue";
import GameTimer from "@/components/GameTimer.vue";
</script>

<template>
  <main class="game-view">
    <GameTimer />
    <GameScore />
    <GameRoster />
  </main>
</template>

<style scoped lang="scss">
.game-view {
  margin-bottom: 30em;
}
</style>