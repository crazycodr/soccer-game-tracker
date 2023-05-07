<script setup lang="ts">
import {useTeamStore} from "@/stores/TeamStore";
import {computed} from "vue";
import {ElColorPicker} from "element-plus";

const {removeTeamByName, setTeamColor} = useTeamStore();

const props = defineProps(['name', 'color'])

const selectedColor = computed({
  get() {
    console.log(props.color)
    return props.color
  },
  set(value: string){
    console.log(value)
    setTeamColor(props.name, value)
  }
})
</script>

<template>
  <main>
    <div class="name">{{name}}</div>
    <div class="commands">
      <el-color-picker v-model="selectedColor" />
      <el-button @click="() => removeTeamByName(name)">Delete</el-button>
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
  align-content: center;
}
.name {
  flex-basis: 50%;
  font-size: 1.2em;
  text-transform: capitalize;
  margin-bottom: 0.5em;
  font-weight: bold;
}
.commands {
  display: flex;
  flex-basis: 50%;
  justify-content: space-between;
}
.commands > * {
  margin-left: 1em;
}
</style>