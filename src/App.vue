<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <el-menu default-active="1" mode="horizontal">
    <el-menu-item index="1">
      <RouterLink to="/">Game</RouterLink>
    </el-menu-item>
    <el-menu-item index="2">
      <RouterLink to="/config">Configure</RouterLink>
    </el-menu-item>
  </el-menu>

  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped>
.el-menu {
  margin-bottom: 1em;
}
.content {
  padding: 1em;
}
</style>
