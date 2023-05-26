<script setup lang="ts">
import {useGameStore} from "@/stores/GameStore";
</script>

<template>
  <el-row>
    <el-col>
      <p>The game has not started yet. Please set up the rosters in the next tab and then click the start game button.</p>
      <el-button type="primary" @click="useGameStore().startGame">Start the game</el-button>
    </el-col>
  </el-row>
</template>