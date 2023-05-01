<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Game</RouterLink>
      <RouterLink to="/config">Configure</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2em;
}

nav a.router-link-exact-active {
  color: var(--vt-c-white-soft);
  font-weight: bold;
  background-color: var(--vt-c-text-light-1);
}

nav a {
  display: inline-block;
  border: 1px solid black;
  padding: 0.5em 1.5em;
  font-size: 1em;
  text-align: center;
  flex-grow: 1;
}
</style>
