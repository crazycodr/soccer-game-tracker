<script setup lang="ts">
import {RouterView} from 'vue-router'
</script>

<template>
  <el-menu :router="true" default-active="/game" mode="horizontal">
    <el-menu-item index="/game">Game</el-menu-item>
    <el-menu-item index="/operations">Operations</el-menu-item>
    <el-menu-item index="/config">Configure</el-menu-item>
  </el-menu>

  <div class="content">
    <RouterView/>
  </div>
</template>

<style scoped lang="scss">
.content {
  padding: 1em;
}
</style>
