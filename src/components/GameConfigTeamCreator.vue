<script setup lang="ts">
import {computed, ref} from "vue"
import {TeamAlreadyExistsException} from "@/stores/exceptions/TeamAlreadyExistsException";
import {useTeamStore} from "@/stores/TeamStore";
import {Team} from "@/stores/models/Team";

const {addTeam} = useTeamStore();

const name = ref('')
const error = ref('')

function keyupHandler(key: KeyboardEvent) {
  error.value = ''
  if (key.key === 'Enter') {
    create()
  }
}

const isEmpty = computed((): boolean => {
  return name.value.trim() === ''
})

function create() {
  try {
    addTeam(new Team(name.value))
    name.value = ''
  } catch (exception) {
    console.log(exception)
    if (exception instanceof TeamAlreadyExistsException) {
      error.value = exception.message
    } else {
      error.value = 'An error occurred'
    }
  }
}
</script>

<template>
  <main>
    <div>
      <input @keyup="keyupHandler" v-model="name" placeholder="Team name" />
      <input :disabled="isEmpty" type="button" @click="create" value="Create" />
    </div>
    <div class="error" v-if="error">
      {{error}}
    </div>
  </main>
</template>

<style scoped>
input[type="button"] {
  margin-left: 1em;
}

.error {
  color: red;
}
</style>