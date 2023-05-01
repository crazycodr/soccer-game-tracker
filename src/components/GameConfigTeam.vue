<script setup lang="ts">

import {useGameStore} from "@/stores/game";

const {removeTeamByName, setTeamColor} = useGameStore();

defineProps(['name', 'color'])
</script>

<template>
  <main>
    <div class="name">{{name}}</div>
    <div class="commands">
      <div @click="setTeamColor(name, 'red')" style="background-color: red" :class="{colorSelector: true, selected: color === 'red'}"></div>
      <div @click="setTeamColor(name, 'blue')" style="background-color: blue" :class="{colorSelector: true, selected: color === 'blue'}"></div>
      <div @click="setTeamColor(name, 'green')" style="background-color: green" :class="{colorSelector: true, selected: color === 'green'}"></div>
      <div @click="setTeamColor(name, 'yellow')" style="background-color: yellow" :class="{colorSelector: true, selected: color === 'yellow'}"></div>
      <input type="button" @click="() => removeTeamByName(name)" value="Delete" />
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: #f1f1f1;
  padding: 0.5em;
  margin-top: 0.5em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.name {
  font-size: 1.2em;
  text-transform: capitalize;
  margin-bottom: 0.5em;
  font-weight: bold;
}
.commands {
  display: flex;
  align-items: center;
}
.colorSelector {
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  margin-right: 1em;
}
.colorSelector.selected {
  border: 3px solid black;
}
</style>