<script setup lang="ts">
import GameScore from "@/components/GameScore.vue";
import GameRoster from "@/components/GameRoster.vue";
import GameTimer from "@/components/GameTimer.vue";
import {useGameStore} from "@/stores/game";
import {storeToRefs} from "pinia";

const {getGame} = storeToRefs(useGameStore());
</script>

<template>
  <main>
    <GameTimer :status="getGame.status" :seconds="getGame.seconds" />
    <GameScore />
    <GameRoster />
  </main>
</template>
