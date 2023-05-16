<script setup lang="ts">
import GameScore from "@/components/game/tracking/TeamScores.vue";
import GameRoster from "@/components/game/tracking/RosterList.vue";
import GameTimer from "@/components/game/tracking/GameTimer.vue";
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