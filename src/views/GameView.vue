<script setup lang="ts">
import GameScore from "@/components/game/tracking/Score.vue";
import GameRoster from "@/components/game/tracking/Roster.vue";
import GameTimer from "@/components/game/tracking/Timer.vue";
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