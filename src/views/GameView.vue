<script setup lang="ts">
import GameScore from "@/components/GameScore.vue";
import GameRoster from "@/components/GameRoster.vue";
import GameTimer from "@/components/GameTimer.vue";
import {useGameStore} from "@/stores/GameStore";
import {storeToRefs} from "pinia";

const {getGame} = storeToRefs(useGameStore());
</script>

<template>
  <main class="game-view">
    <GameTimer :status="getGame.status" :seconds="getGame.seconds" />
    <GameScore />
    <GameRoster />
  </main>
</template>

<style scoped>
.game-view {
  margin-bottom: 30em;
}
</style>