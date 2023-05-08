<script setup lang="ts">
import {useTeamStore} from "@/stores/TeamStore";
import {computed} from "vue";
import {ElColorPicker, ElMessageBox} from "element-plus";

const {removeTeamByName, setTeamColor} = useTeamStore();

const props = defineProps(['name', 'color'])

const selectedColor = computed({
  get() {
    return props.color
  },
  set(value: string) {
    setTeamColor(props.name, value)
  }
})

const confirmDeletion = () => {
  ElMessageBox.confirm(
      `Team to be deleted: ${props.name}`,
      'Confirm deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
  ).then(() => {
    removeTeamByName(props.name)
  })
}
</script>

<template>
  <main>
    <div class="name">{{name}}</div>
    <el-color-picker v-model="selectedColor" />
    <el-button icon="RemoveFilled" @click="confirmDeletion">Delete</el-button>
  </main>
</template>

<style scoped>
main {
  padding: 0.5em;
  margin-top: 0.5em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  border-bottom: 2px dotted lightgrey;
}
.name {
  flex-basis: 50%;
  font-size: 1.2em;
  text-transform: capitalize;
}
</style>